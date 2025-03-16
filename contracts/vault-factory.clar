;; Creates and manages user vaults with different strategies

(define-map vaults
  {vault-id: uint}
  {
    owner: principal,
    strategy-id: uint,
    sbtc-balance: uint,
    created-at: uint,
    active: bool
  }
)

(define-data-var vault-nonce uint u0)

;; Add a map to track last operation time for rate limiting
(define-map last-operation
  {vault-id: uint, operation-type: (string-ascii 10)}
  {block-height: uint}
)

(define-public (create-vault (strategy-id uint))
  (let
    (
      (vault-id (var-get vault-nonce))
      (caller tx-sender)
    )
    ;; Verify strategy exists
    (asserts! (contract-call? .strategy-registry strategy-exists strategy-id) (err u100))
    
    ;; Create new vault
    (map-set vaults 
      {vault-id: vault-id}
      {
        owner: caller,
        strategy-id: strategy-id,
        sbtc-balance: u0,
        created-at: stacks-block-height,
        active: true
      }
    )
    
    ;; Increment nonce
    (var-set vault-nonce (+ vault-id u1))
    
    (ok vault-id)
  )
)

(define-public (deposit (vault-id uint) (amount uint))
  (begin
    ;; Add validation for non-zero amount
    (asserts! (> amount u0) (err u105))
    
    ;; Add validation for vault-id bounds
    (asserts! (< vault-id (var-get vault-nonce)) (err u106))
    
    (let
      (
        (vault (unwrap! (map-get? vaults {vault-id: vault-id}) (err u101)))
        (owner (get owner vault))
        (strategy-id (get strategy-id vault))
        (current-balance (get sbtc-balance vault))
        (last-op (default-to {block-height: u0} 
          (map-get? last-operation {vault-id: vault-id, operation-type: "deposit"})))
        (current-height stacks-block-height)
      )
      ;; Verify caller is owner
      (asserts! (is-eq tx-sender owner) (err u102))
      
      ;; Verify vault is active
      (asserts! (get active vault) (err u103))
      
      ;; Prevent too frequent operations (optional rate limiting)
      (asserts! (> (- current-height (get block-height last-op)) u10) (err u108))
      
      ;; Update last operation time
      (map-set last-operation 
        {vault-id: vault-id, operation-type: "deposit"}
        {block-height: current-height}
      )
      
      ;; Transfer sBTC to this contract
      (try! (contract-call? .sbtc-token transfer amount tx-sender (as-contract tx-sender) none))
      
      ;; Update vault balance
      (map-set vaults 
        {vault-id: vault-id}
        (merge vault {sbtc-balance: (+ current-balance amount)})
      )
      
      ;; Deploy funds according to strategy
      (try! (contract-call? .strategy-registry execute-strategy strategy-id amount))
      
      (ok true)
    )
  )
)

(define-public (withdraw (vault-id uint) (amount uint))
  (begin
    ;; Validate amount
    (asserts! (> amount u0) (err u105))
    
    ;; Validate vault-id is within bounds
    (asserts! (< vault-id (var-get vault-nonce)) (err u106))
    
    (let
      (
        (vault (unwrap! (map-get? vaults {vault-id: vault-id}) (err u101)))
        (owner (get owner vault))
        (strategy-id (get strategy-id vault))
        (current-balance (get sbtc-balance vault))
        (last-op (default-to {block-height: u0} 
          (map-get? last-operation {vault-id: vault-id, operation-type: "withdraw"})))
        (current-height stacks-block-height)
      )
      ;; Verify caller is owner
      (asserts! (is-eq tx-sender owner) (err u102))
      
      ;; Verify vault is active
      (asserts! (get active vault) (err u103))
      
      ;; Verify sufficient balance
      (asserts! (>= current-balance amount) (err u104))
      
      ;; Prevent too frequent operations
      (asserts! (> (- current-height (get block-height last-op)) u10) (err u108))
      
      ;; Update last operation time
      (map-set last-operation 
        {vault-id: vault-id, operation-type: "withdraw"}
        {block-height: current-height}
      )
      
      ;; Retrieve funds from strategy
      (try! (contract-call? .strategy-registry withdraw-from-strategy strategy-id amount))
      
      ;; Transfer sBTC back to user
      (try! (as-contract (contract-call? .sbtc-token transfer amount tx-sender owner none)))
      
      ;; Update vault balance
      (map-set vaults 
        {vault-id: vault-id}
        (merge vault {sbtc-balance: (- current-balance amount)})
      )
      
      (ok true)
    )
  )
)

(define-public (change-strategy (vault-id uint) (new-strategy-id uint))
  (begin
    ;; Validate vault-id is within bounds
    (asserts! (< vault-id (var-get vault-nonce)) (err u106))
    
    (let
      (
        (vault (unwrap! (map-get? vaults {vault-id: vault-id}) (err u101)))
        (owner (get owner vault))
        (old-strategy-id (get strategy-id vault))
        (current-balance (get sbtc-balance vault))
        (last-op (default-to {block-height: u0} 
          (map-get? last-operation {vault-id: vault-id, operation-type: "strategy"})))
        (current-height stacks-block-height)
      )
      ;; Verify caller is owner
      (asserts! (is-eq tx-sender owner) (err u102))
      
      ;; Verify vault is active
      (asserts! (get active vault) (err u103))
      
      ;; Check that new strategy is different
      (asserts! (not (is-eq old-strategy-id new-strategy-id)) (err u107))
      
      ;; Verify new strategy exists
      (asserts! (contract-call? .strategy-registry strategy-exists new-strategy-id) (err u100))
      
      ;; Prevent too frequent operations
      (asserts! (> (- current-height (get block-height last-op)) u10) (err u108))
      
      ;; Update last operation time
      (map-set last-operation 
        {vault-id: vault-id, operation-type: "strategy"}
        {block-height: current-height}
      )
      
      ;; If balance exists, move funds between strategies
      (if (> current-balance u0)
        (begin
          ;; Withdraw all funds from current strategy
          (try! (contract-call? .strategy-registry withdraw-from-strategy old-strategy-id current-balance))
          
          ;; Deploy to new strategy
          (try! (contract-call? .strategy-registry execute-strategy new-strategy-id current-balance))
        )
        true
      )
      
      ;; Update vault strategy
      (map-set vaults 
        {vault-id: vault-id}
        (merge vault {strategy-id: new-strategy-id})
      )
      
      (ok true)
    )
  )
)

(define-read-only (get-vault-balance (vault-id uint))
  (begin
    ;; Validate vault-id is within bounds
    (asserts! (< vault-id (var-get vault-nonce)) (err u106))
    
    (let
      (
        (vault (map-get? vaults {vault-id: vault-id}))
      )
      (if (is-some vault)
        (ok (get sbtc-balance (unwrap-panic vault)))
        (err u101)
      )
    )
  )
)

;; Simple helper function to get vault info
(define-read-only (get-vault-info (vault-id uint))
  (begin
    ;; Validate vault-id is within bounds
    (asserts! (< vault-id (var-get vault-nonce)) (err u106))
    
    (let
      (
        (vault (map-get? vaults {vault-id: vault-id}))
      )
      (if (is-some vault)
        (ok (unwrap-panic vault))
        (err u101)
      )
    )
  )
)

;; Simple helper function to check if user owns a vault
(define-read-only (is-vault-owner (vault-id uint) (user principal))
  (begin
    ;; Validate vault-id is within bounds
    (asserts! (< vault-id (var-get vault-nonce)) (err u106))
    
    (let
      (
        (vault (map-get? vaults {vault-id: vault-id}))
      )
      (if (is-some vault)
        (ok (is-eq (get owner (unwrap-panic vault)) user))
        (err u101)
      )
    )
  )
)