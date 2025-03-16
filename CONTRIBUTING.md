# Contributing to sBTC Yield Nexus

We're excited that you're interested in contributing to sBTC Yield Nexus! This document provides guidelines and instructions for contributing.

## Development Setup

1. Install Prerequisites:

   - Clarinet v1.5+
   - Stacks node v2.3+
   - VS Code with Clarity extension

2. Clone and Setup:
   ```bash
   git clone https://github.com/your-org/sbtc-yield-nexus
   cd sbtc-yield-nexus
   clarinet integrate
   ```

## Coding Standards

### Clarity Code Style

- Use clear, descriptive names for functions and variables
- Document all public functions with docstrings
- Include error codes in function documentation
- Follow the principle of least privilege

Example:

```clarity
;; @desc Deposits sBTC and mints ysBTC tokens
;; @param amount uint - Amount of sBTC to deposit
;; @error 500 - Invalid deposit amount
;; @error 506 - Insufficient protocol liquidity
(define-public (deposit (amount uint))
  (begin
    (asserts! (> amount u0) (err u500))
    ;; Implementation
    )
)
```

### Testing Requirements

- Write unit tests for all public functions
- Include integration tests for complex interactions
- Test error conditions and edge cases
- Document test scenarios

## Pull Request Process

1. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes:

   - Follow coding standards
   - Add tests
   - Update documentation

3. Submit PR with:
   - Clear description
   - Test results
   - Documentation updates

## Code Review Process

All submissions require review. We use GitHub pull requests for this purpose.

1. Submit a pull request
2. Address review feedback
3. Maintain thread until approval
4. Squash commits before merge

## Documentation

Update relevant documentation:

- README.md for high-level changes
- Contract documentation for interface changes
- Testing documentation for new test cases
- Deployment guides if applicable
