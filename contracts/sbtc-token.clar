(define-constant ERR_NOT_OWNER (err u4)) ;; `tx-sender` or `contract-caller` tried to move a token it does not own.
(define-constant ERR_TRANSFER_INDEX_PREFIX u1000)
(define-constant ERR_ZERO_AMOUNT (err u100))
(define-constant ERR_EMPTY_STRING (err u101))
(define-constant ERR_INSUFFICIENT_BALANCE (err u102))
(define-constant ERR_SAME_SENDER_RECIPIENT (err u103))

(define-fungible-token sbtc-token)
(define-fungible-token sbtc-token-locked)

(define-data-var token-name (string-ascii 32) "sBTC")
(define-data-var token-symbol (string-ascii 10) "sBTC")
(define-data-var token-uri (optional (string-utf8 256)) (some u"https://ipfs.io/ipfs/bafkreibqnozdui4ntgoh3oo437lvhg7qrsccmbzhgumwwjf2smb3eegyqu"))
(define-constant token-decimals u8)

;; --- Protocol functions

(define-public (protocol-lock (amount uint) (owner principal) (contract-flag (buff 1)))
    (begin
        (try! (contract-call? .sbtc-registry is-protocol-caller contract-flag contract-caller))
        ;; Validate amount
        (asserts! (> amount u0) ERR_ZERO_AMOUNT)
        ;; Validate owner has sufficient balance
        (asserts! (<= amount (ft-get-balance sbtc-token owner)) ERR_INSUFFICIENT_BALANCE)
        (try! (ft-burn? sbtc-token amount owner))
        (try! (ft-mint? sbtc-token-locked amount owner))
        (ok true)
    )
)

(define-public (protocol-unlock (amount uint) (owner principal) (contract-flag (buff 1)))
    (begin
        (try! (contract-call? .sbtc-registry is-protocol-caller contract-flag contract-caller))
        ;; Validate amount
        (asserts! (> amount u0) ERR_ZERO_AMOUNT)
        ;; Validate owner has sufficient locked balance
        (asserts! (<= amount (ft-get-balance sbtc-token-locked owner)) ERR_INSUFFICIENT_BALANCE)
        (try! (ft-burn? sbtc-token-locked amount owner))
        (try! (ft-mint? sbtc-token amount owner))
        (ok true)
    )
)

(define-public (protocol-mint (amount uint) (recipient principal) (contract-flag (buff 1)))
    (begin
        (try! (contract-call? .sbtc-registry is-protocol-caller contract-flag contract-caller))
        ;; Validate amount
        (asserts! (> amount u0) ERR_ZERO_AMOUNT)
        
        ;; For principal validation, we can add a check that it's not equal to the contract itself
        ;; This is a common validation for recipients
        (asserts! (not (is-eq recipient (as-contract tx-sender))) (err u104))
        
        ;; Alternatively, we can check against a list of known restricted addresses
        ;; (asserts! (not (is-eq recipient contract-caller)) (err u105))
        
        (try! (ft-mint? sbtc-token amount recipient))
        (ok true)
    )
)

(define-public (protocol-burn (amount uint) (owner principal) (contract-flag (buff 1)))
    (begin
        (try! (contract-call? .sbtc-registry is-protocol-caller contract-flag contract-caller))
        ;; Validate amount
        (asserts! (> amount u0) ERR_ZERO_AMOUNT)
        ;; Validate owner has sufficient balance
        (asserts! (<= amount (ft-get-balance sbtc-token owner)) ERR_INSUFFICIENT_BALANCE)
        (try! (ft-burn? sbtc-token amount owner))
        (ok true)
    )
)


(define-public (protocol-burn-locked (amount uint) (owner principal) (contract-flag (buff 1)))
    (begin
        (try! (contract-call? .sbtc-registry is-protocol-caller contract-flag contract-caller))
        ;; Validate amount
        (asserts! (> amount u0) ERR_ZERO_AMOUNT)
        ;; Validate owner has sufficient locked balance
        (asserts! (<= amount (ft-get-balance sbtc-token-locked owner)) ERR_INSUFFICIENT_BALANCE)
        ;; Fix: Use sbtc-token-locked instead of sbtc-token
        (try! (ft-burn? sbtc-token-locked amount owner))
        (ok true)
    )
)

(define-public (protocol-set-name (new-name (string-ascii 32)) (contract-flag (buff 1)))
  (begin
    ;; Access control (already exists)
    (try! (contract-call? .sbtc-registry is-protocol-caller contract-flag contract-caller))
    
    ;; Parameter validation
    (asserts! (not (is-eq new-name "")) (err u300)) ;; Non-empty name
    
    ;; Operation (already exists)
    (ok (var-set token-name new-name))
  )
)

(define-public (protocol-set-symbol (new-symbol (string-ascii 10)) (contract-flag (buff 1)))
    (begin
        (try! (contract-call? .sbtc-registry is-protocol-caller contract-flag contract-caller))
        ;; Validate symbol is not empty
        (asserts! (not (is-eq new-symbol "")) ERR_EMPTY_STRING)
        (ok (var-set token-symbol new-symbol))
    )
)

(define-public (protocol-set-token-uri (new-uri (optional (string-utf8 256))) (contract-flag (buff 1)))
    (begin
        (try! (contract-call? .sbtc-registry is-protocol-caller contract-flag contract-caller))
        
        ;; For optional values, we can validate by checking if it exists
        (match new-uri
            some-uri 
                (begin
                    ;; Check the URI isn't empty if it's provided
                    (asserts! (> (len some-uri) u0) ERR_EMPTY_STRING)
                    (ok (var-set token-uri new-uri))
                )
            ;; If it's none, we accept it (allows clearing the URI)
            (ok (var-set token-uri none))
        )
    )
)

(define-private (protocol-mint-many-iter (item {amount: uint, recipient: principal}))
    (begin
        ;; Validate amount is non-zero
        (asserts! (> (get amount item) u0) ERR_ZERO_AMOUNT)
        (try! (ft-mint? sbtc-token (get amount item) (get recipient item)))
        (ok true)
    )
)

(define-public (protocol-mint-many (recipients (list 200 {amount: uint, recipient: principal})) (contract-flag (buff 1)))
	(begin
		(try! (contract-call? .sbtc-registry is-protocol-caller contract-flag contract-caller))
		(ok (map protocol-mint-many-iter recipients))
	)
)

;; --- Public functions
(define-public (transfer-many
				(recipients (list 200 {
					amount: uint,
					sender: principal,
					to: principal,
					memo: (optional (buff 34)) })))
	(fold transfer-many-iter recipients (ok u0))
)

(define-private (transfer-many-iter
					(individual-transfer {
						amount: uint,
						sender: principal,
						to: principal,
						memo: (optional (buff 34)) })
					(result (response uint uint)))
	(match result
		index
			(begin
				(unwrap!
					(transfer
						(get amount individual-transfer)
						(get sender individual-transfer)
						(get to individual-transfer)
						(get memo individual-transfer))
				(err (+ ERR_TRANSFER_INDEX_PREFIX index)))
				(ok (+ index u1))
			)
		err-index
			(err err-index)
	)
)

;; sip-010-trait

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    ;; Ownership check (already exists)
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) ERR_NOT_OWNER)
    
    ;; Parameter validation (to add)
    (asserts! (> amount u0) (err u200)) ;; Non-zero amount
    (asserts! (<= amount (ft-get-balance sbtc-token sender)) (err u201)) ;; Sufficient balance
    (asserts! (not (is-eq sender recipient)) (err u202)) ;; Different sender/recipient
    
    ;; Operation (already exists)
    (try! (ft-transfer? sbtc-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-read-only (get-name)
	(ok (var-get token-name))
)

(define-read-only (get-symbol)
	(ok (var-get token-symbol))
)

(define-read-only (get-decimals)
	(ok token-decimals)
)

(define-read-only (get-balance (who principal))
	(ok (+ (ft-get-balance sbtc-token who) (ft-get-balance sbtc-token-locked who)))
)

(define-read-only (get-balance-available (who principal))
	(ok (ft-get-balance sbtc-token who))
)

(define-read-only (get-balance-locked (who principal))
	(ok (ft-get-balance sbtc-token-locked who))
)

(define-read-only (get-total-supply)
	(ok (+ (ft-get-supply sbtc-token) (ft-get-supply sbtc-token-locked)))
)

(define-read-only (get-token-uri)
	(ok (var-get token-uri))
)