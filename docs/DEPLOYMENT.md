# Deployment Guide

## Prerequisites

- Clarinet v1.5+
- Stacks node v2.3+
- Multi-sig wallet
- Access credentials

## Deployment Steps

### 1. Environment Setup

```bash
# Set environment variables
export STACKS_NETWORK=mainnet
export DEPLOYER_KEY=<your-private-key>
```

### 2. Contract Deployment

Deploy in specific order:

```bash
# 1. Deploy Registry
clarinet deploy sbtc-registry.clar

# 2. Deploy Token Contracts
clarinet deploy sbtc-token.clar
clarinet deploy ysbtc-token.clar

# 3. Deploy Core Systems
clarinet deploy strategy-registry.clar
clarinet deploy vault-factory.clar
clarinet deploy risk-engine.clar
```

### 3. Configuration

Initialize core components:

```clarity
;; Set initial governor
(contract-call? .governance set-governor <governor-address>)

;; Configure risk parameters
(contract-call? .risk-engine set-base-parameters
  u80  ;; base score
  u10  ;; age factor
  u5   ;; tvl factor
  u5   ;; audit factor
)
```

### 4. Verification

Verify deployment:

```bash
# Check contract versions
clarinet check-deployment

# Verify governance
clarinet contract-call .governance get-governor

# Test basic operations
clarinet contract-call .ysbtc-token get-exchange-rate
```

## Post-Deployment

### 1. Security Setup

- Enable time locks
- Set rate limits
- Configure circuit breakers

### 2. Protocol Integration

- Register protocols
- Create initial strategies
- Set allocation limits

### 3. Monitoring

Setup monitoring for:

- TVL changes
- APY variations
- Failed transactions
- Security events

## Emergency Procedures

### Quick Response Actions

1. Pause Protocol:

```clarity
(contract-call? .governance emergency-pause)
```

2. Secure Assets:

```clarity
(contract-call? .vault-factory emergency-withdraw)
```

### Recovery Steps

1. Assess situation
2. Execute recovery plan
3. Resume operations
4. Post-mortem analysis

## Upgrade Procedures

1. Deploy new contracts
2. Verify functionality
3. Migrate state
4. Update references
