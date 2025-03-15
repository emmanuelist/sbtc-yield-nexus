;; Controls access to admin functions in the protocol

(define-data-var governor principal tx-sender)
(define-data-var risk-oracle principal tx-sender)
(define-data-var yield-harvester principal tx-sender)

(define-read-only (get-governor)
  (var-get governor)
)

(define-read-only (get-risk-oracle)
  (var-get risk-oracle)
)

(define-read-only (get-yield-harvester)
  (var-get yield-harvester)
)

(define-public (set-governor (new-governor principal))
  (begin
    (asserts! (is-eq tx-sender (var-get governor)) (err u1))
    (var-set governor new-governor)
    (ok true)
  )
)

(define-public (set-risk-oracle (new-oracle principal))
  (begin
    (asserts! (is-eq tx-sender (var-get governor)) (err u1))
    (var-set risk-oracle new-oracle)
    (ok true)
  )
)

(define-public (set-yield-harvester (new-harvester principal))
  (begin
    (asserts! (is-eq tx-sender (var-get governor)) (err u1))
    (var-set yield-harvester new-harvester)
    (ok true)
  )
)