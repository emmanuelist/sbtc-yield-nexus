# Testing Guide

# sBTC Smart Contract Testing Guide for Clarinet

This guide provides a systematic approach to testing the sBTC (Stacks Bitcoin) smart contracts through the Clarinet console. Follow these steps in order, as each step builds upon the previous one.

## 1. Initial Setup

Start by setting yourself as the governor, which will grant you the necessary permissions to perform administrative actions:

```clarity
;; Set yourself as the governor
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.governance set-governor tx-sender)

;; Verify you are now the governor
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.governance get-governor)
```

## 2. Protocol Registration

Register a protocol in the strategy registry:

```clarity
;; Register a test protocol
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.strategy-registry register-protocol "Test Protocol" 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token "transfer" "transfer")

;; Verify the protocol exists (should return true)
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.strategy-registry protocol-exists u0)
```

## 3. Risk Engine Configuration

Configure the risk score for your protocol:

```clarity
;; Set risk score for the protocol
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.risk-engine update-risk-score u0 u80 u10 u5 u5)

;; Verify the risk score
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.risk-engine get-risk-score u0)

;; Calculate the protocol score
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.risk-engine calculate-protocol-score u0)
```

## 4. Strategy Creation

Create a strategy using your registered protocol:

```clarity
;; Activate the protocol (if not already active)
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.strategy-registry set-protocol-status u0 true)

;; Create a strategy
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.strategy-registry create-strategy "Conservative Strategy" u2 (list u0))

;; Verify the strategy exists
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.strategy-registry strategy-exists u0)
```

## 5. Vault Creation

Create a vault using your strategy:

```clarity
;; Create a vault
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.vault-factory create-vault u0)

;; Get vault information
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.vault-factory get-vault-info u0)

;; Verify ownership
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.vault-factory is-vault-owner u0 tx-sender)
```

## 6. Token Operations Setup

Set yourself as the necessary roles:

```clarity
;; Set yourself as the risk oracle
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.governance set-risk-oracle tx-sender)

;; Set yourself as the yield harvester
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.governance set-yield-harvester tx-sender)

;; Verify your roles
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.governance get-risk-oracle)
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.governance get-yield-harvester)
```

## 7. sBTC Protocol Updates

Update the protocol contract in the registry:

```clarity
;; Update the protocol contract in the registry
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-registry update-protocol-contract 0x01 tx-sender)

;; Verify the update
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-registry get-active-protocol 0x01)
```

## 8. Token Minting

Mint sBTC tokens for testing:

```clarity
;; Mint sBTC tokens
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token protocol-mint u1000000 tx-sender 0x01)

;; Check your balance
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token get-balance tx-sender)
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token get-balance-available tx-sender)
```

## 9. ySBTC Operations

Test ySBTC token operations:

```clarity
;; Get ySBTC exchange rate
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ysbtc-token get-exchange-rate)

;; Check conversion rates
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ysbtc-token sbtc-to-ysbtc u1000000)
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ysbtc-token ysbtc-to-sbtc u1000000)

;; Deposit sBTC to get ySBTC
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ysbtc-token deposit u100000)

;; Check ySBTC balance
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ysbtc-token get-balance tx-sender)
```

## 10. Strategy Execution

Execute your strategy:

```clarity
;; Check allocations
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.risk-engine get-allocations u0 (list u0))

;; Propose a strategy update
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.strategy-registry propose-strategy-update u0 (list u0))

;; Execute the strategy update
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.strategy-registry execute-strategy-update u0)

;; Execute the strategy with an amount
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.strategy-registry execute-strategy u0 u100000)
```

## 11. Additional Token Operations

Test additional token operations:

```clarity
;; Check locked and available balances
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token get-balance-locked tx-sender)
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token get-balance-available tx-sender)

;; Check total supply
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token get-total-supply)
```

## 12. Vault Operations

Test vault operations:

```clarity
;; Get vault balance
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.vault-factory get-vault-balance u0)

;; Try to deposit into the vault (may require additional setup)
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.vault-factory deposit u0 u50000)
```

## Working With Error Codes

When you encounter an error, look at the error code and make adjustments accordingly:

1. If a command fails with a permission error, try setting yourself as the appropriate role.
2. If a token operation fails, check your balance and make sure you have enough tokens.
3. If a strategy or vault operation fails, verify that the prerequisites are met.

Remember that the contracts are interconnected, so changes in one contract might affect others. Work through the steps systematically, and don't be afraid to go back and verify previous steps if you encounter issues.
