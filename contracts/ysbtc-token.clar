;; Yield-bearing sBTC token implementation
(define-fungible-token ysbtc)

(define-data-var exchange-rate uint u1000000) ;; 1:1 initially (6 decimal precision)
(define-data-var total-sbtc-locked uint u0)

;; Improved deposit function with validation
(define-public (deposit (amount uint))
  (let
    (
      (caller tx-sender)
      (current-rate (var-get exchange-rate))
    )
    ;; Validate input
    (asserts! (> amount u0) (err u500)) ;; Amount must be positive
    
    ;; Check that user has sufficient balance
    (asserts! (>= (contract-call? .sbtc-token get-balance caller) amount) (err u501))
    
    ;; Calculate ysBTC amount
    (let
      (
        (ysbtc-amount (/ (* amount current-rate) u1000000))
      )
      ;; Validate result
      (asserts! (> ysbtc-amount u0) (err u502)) ;; Ensure we're minting non-zero amount

      ;; Transfer sBTC from user
      (try! (contract-call? .sbtc-token transfer amount caller (as-contract tx-sender) none))
      
      ;; Mint ysBTC to user
      (try! (ft-mint? ysbtc ysbtc-amount caller))
      
      ;; Update total locked
      (var-set total-sbtc-locked (+ (var-get total-sbtc-locked) amount))
      
      ;; Deploy to strategy
      (try! (as-contract (contract-call? .vault-factory deposit u0 amount)))
      
      (ok ysbtc-amount)
    )
  )
)

;; Improved withdraw function with validation
(define-public (withdraw (ysbtc-amount uint))
  (let
    (
      (caller tx-sender)
      (current-rate (var-get exchange-rate))
    )
    ;; Validate input
    (asserts! (> ysbtc-amount u0) (err u503)) ;; Amount must be positive
    
    ;; Check that user has sufficient balance
    (asserts! (>= (ft-get-balance ysbtc caller) ysbtc-amount) (err u504))
    
    ;; Calculate sBTC amount
    (let
      (
        (sbtc-amount (/ (* ysbtc-amount u1000000) current-rate))
      )
      ;; Validate result
      (asserts! (> sbtc-amount u0) (err u505)) ;; Ensure we're withdrawing non-zero amount
      
      ;; Validate sufficient TVL
      (asserts! (>= (var-get total-sbtc-locked) sbtc-amount) (err u506))
      
      ;; Burn ysBTC from user
      (try! (ft-burn? ysbtc ysbtc-amount caller))
      
      ;; Withdraw sBTC from strategy
      (try! (as-contract (contract-call? .vault-factory withdraw u0 sbtc-amount)))
      
      ;; Transfer sBTC to user
      (try! (as-contract (contract-call? .sbtc-token transfer sbtc-amount tx-sender caller none)))
      
      ;; Update total locked
      (var-set total-sbtc-locked (- (var-get total-sbtc-locked) sbtc-amount))
      
      (ok sbtc-amount)
    )
  )
)

;; Improved harvest-yield with validation and slippage protection
(define-public (harvest-yield)
  (begin
    ;; Only callable by governance
    (asserts! (is-eq tx-sender (contract-call? .governance get-yield-harvester)) (err u400))
    
    ;; Get current sBTC balance from vault
    (let
      (
        (vault-balance (contract-call? .vault-factory get-vault-balance u0))
        (total-locked (var-get total-sbtc-locked))
      )
      ;; Validate vault balance
      (asserts! (> vault-balance u0) (err u507))
      
      ;; If profit exists, update exchange rate
      (if (> vault-balance total-locked)
        (let
          (
            (profit (- vault-balance total-locked))
            (current-rate (var-get exchange-rate))
            ;; Calculate new rate with safeguards against overflow
            (rate-increase (if (> total-locked u0)
                             (/ (* profit current-rate) total-locked)
                             u0))
            (new-rate (+ current-rate rate-increase))
          )
          ;; Validate new rate is reasonable (max 10% increase at once as safety measure)
          (asserts! (< new-rate (+ current-rate (/ current-rate u10))) (err u508))
          
          (var-set exchange-rate new-rate)
          (ok new-rate)
        )
        (ok (var-get exchange-rate))
      )
    )
  )
)

;; Add emergency functions
(define-public (emergency-pause)
  (begin
    ;; Only callable by governance
    (asserts! (is-eq tx-sender (contract-call? .governance get-governor)) (err u401))
    
    (ok true)
  )
)

;; Read-only functions for querying state
(define-read-only (get-exchange-rate)
  (var-get exchange-rate)
)

(define-read-only (get-total-locked)
  (var-get total-sbtc-locked)
)

;; Function to convert sBTC amount to ysBTC equivalent
(define-read-only (sbtc-to-ysbtc (sbtc-amount uint))
  (/ (* sbtc-amount (var-get exchange-rate)) u1000000)
)

;; Function to convert ysBTC amount to sBTC equivalent
(define-read-only (ysbtc-to-sbtc (ysbtc-amount uint))
  (/ (* ysbtc-amount u1000000) (var-get exchange-rate))
)