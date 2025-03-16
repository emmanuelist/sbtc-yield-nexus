# Smart Contract Reference

## Core Contracts

### ysBTC Token (ysbtc.clar)

Yield-bearing sBTC wrapper token implementing dynamic exchange rates and automated yield distribution.

#### Public Functions

```clarity
;; Deposits sBTC for ysBTC tokens
(define-public (deposit (amount uint)) (response uint uint))

;; Withdraws sBTC by burning ysBTC
(define-public (withdraw (ysbtc-amount uint)) (response uint uint))

;; Returns current exchange rate
(define-read-only (get-exchange-rate) (response uint uint))
```

### Vault Factory (vault-factory.clar)

Manages individual user vaults and strategy allocation.

#### Key Functions

```clarity
;; Creates new vault with strategy
(define-public (create-vault (strategy-id uint)) (response uint uint))

;; Deposits funds into vault
(define-public (deposit (vault-id uint) (amount uint)) (response bool uint))
```

### Strategy Registry (strategy-registry.clar)

Coordinates yield strategies and protocol integrations.

#### Core Operations

```clarity
;; Registers new protocol
(define-public (register-protocol
    (name (string-ascii 64))
    (token principal)
    (deposit-function (string-ascii 128))
    (withdraw-function (string-ascii 128))
) (response uint uint))
```

## Error Codes

| Code | Description                     |
| ---- | ------------------------------- |
| 400  | Unauthorized access             |
| 401  | Invalid request ID              |
| 402  | Signature threshold not met     |
| 500  | Invalid deposit amount          |
| 506  | Insufficient protocol liquidity |

## Events

```clarity
;; Deposit Event
(define-data-var DEPOSIT_EVENT
  {
    user: principal,
    amount: uint,
    shares: uint
  }
)

;; Strategy Update Event
(define-data-var STRATEGY_UPDATE_EVENT
  {
    strategy_id: uint,
    allocation: (list 10 uint)
  }
)
```

## Security Model

### Access Control

- Role-based permissions
- Multi-sig requirements
- Time-locked operations

### Economic Security

- TVL caps
- Rate limiting
- Emergency shutdown
