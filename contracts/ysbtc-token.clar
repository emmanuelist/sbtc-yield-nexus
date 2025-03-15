;; Yield-bearing sBTC token implementation

(define-fungible-token ysbtc)

(define-data-var exchange-rate uint u1000000) ;; 1:1 initially (6 decimal precision)
(define-data-var total-sbtc-locked uint u0)

(define-public (deposit (amount uint))
  (let
    (
      (caller tx-sender)
      (current-rate (var-get exchange-rate))
      (ysbtc-amount (/ (* amount current-rate) u1000000))
    )
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

(define-public (withdraw (ysbtc-amount uint))
  (let
    (
      (caller tx-sender)
      (current-rate (var-get exchange-rate))
      (sbtc-amount (/ (* ysbtc-amount u1000000) current-rate))
    )
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
      ;; If profit exists, update exchange rate
      (if (> vault-balance total-locked)
        (let
          (
            (profit (- vault-balance total-locked))
            (current-rate (var-get exchange-rate))
            (new-rate (+ current-rate (/ (* profit current-rate) total-locked)))
          )
          (var-set exchange-rate new-rate)
          (ok new-rate)
        )
        (ok (var-get exchange-rate))
      )
    )
  )
)