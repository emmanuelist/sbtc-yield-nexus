;; Manages risk assessments and allocation distributions

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
    )
    (+ base (+ tvl (+ age audit)))
  )
)

(define-read-only (get-allocations (strategy-id uint) (protocols (list 10 uint)))
  (ok (calculate-allocations protocols))
)

(define-private (calculate-allocations (protocols (list 10 uint)))
  (list
    {protocol-id: (default-to u0 (element-at protocols u0)), percentage: u3000}
    {protocol-id: (default-to u0 (element-at protocols u1)), percentage: u7000}
  )
)