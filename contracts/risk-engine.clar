;; Manages risk assessments and allocation distributions

(define-data-var updating-risk-score bool false)

(define-map protocol-risk-scores
  {protocol-id: uint}
  {
    base-score: uint,
    tvl-factor: uint,
    age-factor: uint,
    audit-factor: uint,
    last-updated: uint
  }
)

(define-public (update-risk-score 
  (protocol-id uint) 
  (base-score uint) 
  (tvl-factor uint)
  (age-factor uint)
  (audit-factor uint)
)
  (begin
    ;; Verify caller is governance or oracle
    (asserts! (or 
      (is-eq tx-sender (contract-call? .governance get-governor))
      (is-eq tx-sender (contract-call? .governance get-risk-oracle))
    ) (err u300))

    ;; Reentrancy protection
    (asserts! (not (var-get updating-risk-score)) (err u350))
    (var-set updating-risk-score true)
    
    ;; Validate inputs
    (asserts! (< u0 protocol-id) (err u301)) ;; Ensure protocol ID is not zero
    (asserts! (< base-score u1000) (err u302)) ;; Example: base score must be under 1000
    (asserts! (< tvl-factor u1000) (err u303)) ;; Example: factors must be under 1000
    (asserts! (< age-factor u1000) (err u304))
    (asserts! (< audit-factor u1000) (err u305))
    
    ;; Update risk score
    (map-set protocol-risk-scores 
      {protocol-id: protocol-id}
      {
        base-score: base-score,
        tvl-factor: tvl-factor,
        age-factor: age-factor,
        audit-factor: audit-factor,
        last-updated: stacks-block-height
      }
    )
    ;; Reset reentrancy guard
    (var-set updating-risk-score false)

    (ok true)
  )
)

(define-read-only (get-risk-score (protocol-id uint))
  (default-to 
    {
      base-score: u0,
      tvl-factor: u0,
      age-factor: u0,
      audit-factor: u0,
      last-updated: u0
    }
    (map-get? protocol-risk-scores {protocol-id: protocol-id})
  )
)

(define-read-only (calculate-protocol-score (protocol-id uint))
  (let
    (
      (risk-data (get-risk-score protocol-id))
      (base (get base-score risk-data))
      (tvl (get tvl-factor risk-data))
      (age (get age-factor risk-data))
      (audit (get audit-factor risk-data))
      (total-score (+ base (+ tvl (+ age audit))))
    )
    ;; Cap the maximum score if needed
    (if (> total-score u10000)
        u10000
        total-score)
  )
)

(define-read-only (get-allocations (strategy-id uint) (protocols (list 10 uint)))
  (ok (calculate-allocations protocols))
)

(define-private (calculate-allocations (protocols (list 10 uint)))
  (let 
    (
      (protocol1 (default-to u0 (element-at protocols u0)))
      (protocol2 (default-to u0 (element-at protocols u1)))
    )
    ;; We can do validation, but must return the same type in all paths
    ;; This function should return a list of allocations
    (if (and (> protocol1 u0) 
             (> protocol2 u0)
             (< u0 (get base-score (get-risk-score protocol1)))
             (< u0 (get base-score (get-risk-score protocol2)))
             (is-eq (+ u3000 u7000) u10000))
        ;; If all validations pass, return the allocation list
        (list
          {protocol-id: protocol1, percentage: u3000}
          {protocol-id: protocol2, percentage: u7000}
        )
        ;; If validation fails, still return a list but with zero allocations
        ;; Or you could default to some safe allocation
        (list
          {protocol-id: u0, percentage: u0}
          {protocol-id: u0, percentage: u0}
        )
    )
  )
)