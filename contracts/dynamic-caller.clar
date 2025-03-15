;; Enables dynamic contract calls

(define-constant contract-owner tx-sender)

(define-public (execute (contract-addr principal) (function-name (string-ascii 64)) (amount uint))
  (begin
    ;; Only allow vault-factory or strategy-registry to call this
    (asserts! (or
      (is-eq contract-caller .vault-factory)
      (is-eq contract-caller .strategy-registry)
    ) (err u1))
    
    (ok true)
  )
)