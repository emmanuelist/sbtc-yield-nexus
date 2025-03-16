;; Manages all yield strategies and their execution

(define-map strategies
  {strategy-id: uint}
  {
    name: (string-ascii 64),
    creator: principal,
    risk-level: uint,
    protocols: (list 10 uint),
    active: bool,
    tvl: uint,
    creation-height: uint
  }
)

(define-map protocol-integrations
  {protocol-id: uint}
  {
    name: (string-ascii 64),
    contract-address: principal,
    function-deposit: (string-ascii 64),
    function-withdraw: (string-ascii 64),
    active: bool
  }
)

(define-data-var strategy-nonce uint u0)
(define-data-var protocol-nonce uint u0)

(define-read-only (strategy-exists (strategy-id uint))
  (is-some (map-get? strategies {strategy-id: strategy-id}))
)

(define-public (register-protocol 
  (name (string-ascii 64)) 
  (contract-address principal) 
  (function-deposit (string-ascii 64))
  (function-withdraw (string-ascii 64))
)
  (let
    (
      (protocol-id (var-get protocol-nonce))
    )
    ;; Verify caller is governance
    (asserts! (is-eq tx-sender (contract-call? .governance get-governor)) (err u200))
    
    ;; Basic input validation
    (asserts! (not (is-eq name "")) (err u210))
    (asserts! (not (is-eq function-deposit "")) (err u211))
    (asserts! (not (is-eq function-withdraw "")) (err u212))
    
    ;; Register protocol
    (map-set protocol-integrations 
      {protocol-id: protocol-id}
      {
        name: name,
        contract-address: contract-address,
        function-deposit: function-deposit,
        function-withdraw: function-withdraw,
        active: true
      }
    )
    
    ;; Increment nonce
    (var-set protocol-nonce (+ protocol-id u1))
    
    (ok protocol-id)
  )
)

(define-public (create-strategy 
  (name (string-ascii 64))
  (risk-level uint)
  (protocols (list 10 uint))
)
  (let
    (
      (strategy-id (var-get strategy-nonce))
      (caller tx-sender)
    )
    ;; Input validation
    (asserts! (not (is-eq name "")) (err u213))
    (asserts! (and (>= risk-level u1) (<= risk-level u10)) (err u214)) ;; Assuming 1-10 scale
    (asserts! (> (len protocols) u0) (err u215))
    
    ;; Verify all protocols exist and are active
    (asserts! (fold check-protocols protocols true) (err u201))
    
    ;; Register strategy
    (map-set strategies 
      {strategy-id: strategy-id}
      {
        name: name,
        creator: caller,
        risk-level: risk-level,
        protocols: protocols,
        active: true,
        tvl: u0,
        creation-height: stacks-block-height
      }
    )
    
    ;; Increment nonce
    (var-set strategy-nonce (+ strategy-id u1))
    
    (ok strategy-id)
  )
)

(define-private (check-protocols (protocol-id uint) (valid bool))
  (if valid
    (is-some (map-get? protocol-integrations {protocol-id: protocol-id}))
    false
  )
)

(define-public (execute-strategy (strategy-id uint) (amount uint))
  (let
    (
      (strategy (unwrap! (map-get? strategies {strategy-id: strategy-id}) (err u202)))
      (protocols (get protocols strategy))
      (current-tvl (get tvl strategy))
    )
    ;; Input validation
    (asserts! (> amount u0) (err u216))
    (asserts! (< (+ current-tvl amount) u1000000000000) (err u217)) ;; Overflow protection
    
    ;; Verify the strategy is active
    (asserts! (get active strategy) (err u203))
    
    ;; Update TVL
    (map-set strategies 
      {strategy-id: strategy-id}
      (merge strategy {tvl: (+ current-tvl amount)})
    )
    
    ;; Call risk engine to update protocol allocations
    (let
      (
        (allocations (unwrap! (contract-call? .risk-engine get-allocations strategy-id protocols) (err u204)))
      )
      ;; Distribute funds according to allocations
      (try! (execute-allocations allocations amount))
      (ok true)
    )
  )
)

(define-private (execute-allocations (allocations (list 10 {protocol-id: uint, percentage: uint})) (total-amount uint))
  (fold execute-allocation allocations (ok true))
)

(define-private (execute-allocation (allocation {protocol-id: uint, percentage: uint}) (previous-result (response bool uint)))
  (match previous-result
    success
      (let
        (
          (protocol-id (get protocol-id allocation))
          (percentage (get percentage allocation))
          (protocol (unwrap! (map-get? protocol-integrations {protocol-id: protocol-id}) (err u205)))
          (contract-addr (get contract-address protocol))
          (deposit-fn (get function-deposit protocol))
          (amount-to-allocate (/ (* percentage u100) u10000))
        )
        ;; Execute dynamic contract call to deposit funds
        (contract-call? .dynamic-caller execute contract-addr deposit-fn amount-to-allocate)
      )
    error (err error)
  )
)

(define-public (withdraw-from-strategy (strategy-id uint) (amount uint))
  (let
    (
      (strategy (unwrap! (map-get? strategies {strategy-id: strategy-id}) (err u202)))
      (protocols (get protocols strategy))
      (current-tvl (get tvl strategy))
    )
    ;; Verify the strategy is active
    (asserts! (get active strategy) (err u203))
    
    ;; Verify sufficient TVL
    (asserts! (>= current-tvl amount) (err u206))
    
    ;; Update TVL
    (map-set strategies 
      {strategy-id: strategy-id}
      (merge strategy {tvl: (- current-tvl amount)})
    )
    
    ;; Calculate withdrawal from each protocol
    (let
      (
        (allocations (unwrap! (contract-call? .risk-engine get-allocations strategy-id protocols) (err u204)))
      )
      ;; Handle withdrawals from protocols
      (try! (execute-withdrawals allocations amount))
      (ok true)
    )
  )
)

;; Emergency withdraw from all protocols
(define-public (emergency-withdraw-all (strategy-id uint))
  (let
    (
      (strategy (unwrap! (map-get? strategies {strategy-id: strategy-id}) (err u202)))
      (protocols (get protocols strategy))
      (current-tvl (get tvl strategy))
    )
    ;; Verify caller is governance
    (asserts! (is-eq tx-sender (contract-call? .governance get-governor)) (err u200))
    
    ;; Force withdraw from all protocols
    (try! (emergency-withdraw-from-protocols protocols))
    
    ;; Mark strategy as inactive
    (map-set strategies 
      {strategy-id: strategy-id}
      (merge strategy {active: false})
    )
    
    (ok true)
  )
)

(define-private (emergency-withdraw-from-protocols (protocol-ids (list 10 uint)))
  (fold emergency-withdraw-from-protocol protocol-ids (ok true))
)

(define-private (emergency-withdraw-from-protocol (protocol-id uint) (previous-result (response bool uint)))
  (match previous-result
    success
      (let
        (
          (protocol (unwrap! (map-get? protocol-integrations {protocol-id: protocol-id}) (err u205)))
          (contract-addr (get contract-address protocol))
          (withdraw-fn (get function-withdraw protocol))
        )
        ;; Try to withdraw all funds from protocol
        ;; Use a maximum value for amount to get everything
        (contract-call? .dynamic-caller execute contract-addr withdraw-fn u1000000000000)
      )
    error (err error)
  )
)

;; Function to execute withdrawals from protocols based on allocations
(define-private (execute-withdrawals (allocations (list 10 {protocol-id: uint, percentage: uint})) (total-amount uint))
  (fold execute-withdrawal-with-amount allocations (ok {result: true, remaining: total-amount}))
)

;; Helper function to add total-amount to each allocation
(define-private (add-amount (allocation {protocol-id: uint, percentage: uint}) (total uint))
  (merge allocation {total-amount: total})
)

;; Modified execute-withdrawal to receive the total amount
(define-private (execute-withdrawal-with-amount 
  (allocation {protocol-id: uint, percentage: uint}) 
  (previous-result (response {result: bool, remaining: uint} uint)))
  (match previous-result
    success-data
      (let
        (
          (protocol-id (get protocol-id allocation))
          (percentage (get percentage allocation))
          (total-amount (get remaining success-data))
          (protocol (unwrap! (map-get? protocol-integrations {protocol-id: protocol-id}) (err u205)))
          (contract-addr (get contract-address protocol))
          (withdraw-fn (get function-withdraw protocol))
          (amount-to-withdraw (/ (* percentage total-amount) u10000))
        )
        ;; Execute dynamic contract call to withdraw funds
        (match (contract-call? .dynamic-caller execute contract-addr withdraw-fn amount-to-withdraw)
          success (ok {result: true, remaining: (- total-amount amount-to-withdraw)})
          error (err error)
        )
      )
    error (err error)
  )
)

(define-private (execute-withdrawal (allocation {protocol-id: uint, percentage: uint, total-amount: uint}) (previous-result (response bool uint)))
  (match previous-result
    success
      (let
        (
          (protocol-id (get protocol-id allocation))
          (percentage (get percentage allocation))
          (protocol (unwrap! (map-get? protocol-integrations {protocol-id: protocol-id}) (err u205)))
          (contract-addr (get contract-address protocol))
          (withdraw-fn (get function-withdraw protocol))
          (amount-to-withdraw (/ (* percentage (get total-amount allocation)) u10000))
        )
        ;; Execute dynamic contract call to withdraw funds
        (contract-call? .dynamic-caller execute contract-addr withdraw-fn amount-to-withdraw)
      )
    error (err error)
  )
)

;; Function to update protocol status
(define-public (set-protocol-status (protocol-id uint) (active bool))
  (let
    (
      (protocol (unwrap! (map-get? protocol-integrations {protocol-id: protocol-id}) (err u205)))
    )
    ;; Verify caller is governance
    (asserts! (is-eq tx-sender (contract-call? .governance get-governor)) (err u200))
    
    ;; Update protocol status
    (map-set protocol-integrations 
      {protocol-id: protocol-id}
      (merge protocol {active: active})
    )
    
    (ok true)
  )
)

;; Timelock for strategy changes
(define-map strategy-change-proposals
  {strategy-id: uint}
  {
    proposed-protocols: (list 10 uint),
    proposed-at: uint,
    proposer: principal
  }
)

(define-data-var timelock-period uint u144) ;; ~1 day in blocks

(define-public (propose-strategy-update (strategy-id uint) (new-protocols (list 10 uint)))
  (let
    (
      (strategy (unwrap! (map-get? strategies {strategy-id: strategy-id}) (err u202)))
      (caller tx-sender)
    )
    ;; Verify caller is owner or governance
    (asserts! (or (is-eq caller (get creator strategy)) 
                 (is-eq caller (contract-call? .governance get-governor))) 
             (err u207))
    
    ;; Verify all protocols exist and are active
    (asserts! (fold check-protocols new-protocols true) (err u201))
    
    ;; Register proposal
    (map-set strategy-change-proposals
      {strategy-id: strategy-id}
      {
        proposed-protocols: new-protocols,
        proposed-at: stacks-block-height,
        proposer: caller
      }
    )
    
    (ok true)
  )
)


(define-public (execute-strategy-update (strategy-id uint))
  (let
    (
      (strategy (unwrap! (map-get? strategies {strategy-id: strategy-id}) (err u202)))
      (proposal (unwrap! (map-get? strategy-change-proposals {strategy-id: strategy-id}) (err u208)))
      (caller tx-sender)
      (timelock (var-get timelock-period))
    )
    ;; Verify caller is owner or governance
    (asserts! (or (is-eq caller (get creator strategy)) 
                 (is-eq caller (contract-call? .governance get-governor))) 
             (err u207))
    
    ;; Verify timelock has passed
    (asserts! (>= (- stacks-block-height (get proposed-at proposal)) timelock) (err u209))
    
    ;; Update strategy protocols
    (map-set strategies 
      {strategy-id: strategy-id}
      (merge strategy {protocols: (get proposed-protocols proposal)})
    )
    
    ;; Clean up proposal
    (map-delete strategy-change-proposals {strategy-id: strategy-id})
    
    (ok true)
  )
)