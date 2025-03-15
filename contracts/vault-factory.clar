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
        created-at: block-height,
        active: true
      }
    )
    
    ;; Increment nonce
    (var-set vault-nonce (+ vault-id u1))
    
    (ok vault-id)
  )
)

(define-public (deposit (vault-id uint) (amount uint))
  (let
    (
      (vault (unwrap! (map-get? vaults {vault-id: vault-id}) (err u101)))
      (owner (get owner vault))
      (strategy-id (get strategy-id vault))
      (current-balance (get sbtc-balance vault))
    )
    ;; Verify caller is owner
    (asserts! (is-eq tx-sender owner) (err u102))
    
    ;; Verify vault is active
    (asserts! (get active vault) (err u103))
    
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

(define-public (withdraw (vault-id uint) (amount uint))
  (let
    (
      (vault (unwrap! (map-get? vaults {vault-id: vault-id}) (err u101)))
      (owner (get owner vault))
      (strategy-id (get strategy-id vault))
      (current-balance (get sbtc-balance vault))
    )
    ;; Verify caller is owner
    (asserts! (is-eq tx-sender owner) (err u102))
    
    ;; Verify vault is active
    (asserts! (get active vault) (err u103))
    
    ;; Verify sufficient balance
    (asserts! (>= current-balance amount) (err u104))
    
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

(define-public (change-strategy (vault-id uint) (new-strategy-id uint))
  (let
    (
      (vault (unwrap! (map-get? vaults {vault-id: vault-id}) (err u101)))
      (owner (get owner vault))
      (old-strategy-id (get strategy-id vault))
      (current-balance (get sbtc-balance vault))
    )
    ;; Verify caller is owner
    (asserts! (is-eq tx-sender owner) (err u102))
    
    ;; Verify vault is active
    (asserts! (get active vault) (err u103))
    
    ;; Verify new strategy exists
    (asserts! (contract-call? .strategy-registry strategy-exists new-strategy-id) (err u100))
    
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