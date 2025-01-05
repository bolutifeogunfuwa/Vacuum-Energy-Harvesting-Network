;; Vacuum Energy Marketplace Contract

(define-fungible-token vacuum-energy-token)

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INSUFFICIENT_BALANCE (err u101))
(define-constant ERR_INVALID_AMOUNT (err u102))

;; Data variables
(define-data-var energy-price uint u100) ;; Price per unit in STX (100 = 1 STX)

;; Public functions
(define-public (mint-energy (amount uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ft-mint? vacuum-energy-token amount tx-sender)
  )
)

(define-public (buy-energy (amount uint))
  (let
    (
      (cost (* amount (var-get energy-price)))
    )
    (try! (stx-transfer? cost tx-sender CONTRACT_OWNER))
    (try! (ft-transfer? vacuum-energy-token amount CONTRACT_OWNER tx-sender))
    (ok true)
  )
)

(define-public (sell-energy (amount uint))
  (let
    (
      (payment (* amount (var-get energy-price)))
    )
    (try! (ft-transfer? vacuum-energy-token amount tx-sender CONTRACT_OWNER))
    (try! (stx-transfer? payment CONTRACT_OWNER tx-sender))
    (ok true)
  )
)

(define-public (set-energy-price (new-price uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ok (var-set energy-price new-price))
  )
)

;; Read-only functions
(define-read-only (get-energy-balance (account principal))
  (ft-get-balance vacuum-energy-token account)
)

(define-read-only (get-energy-supply)
  (ft-get-supply vacuum-energy-token)
)

(define-read-only (get-energy-price)
  (var-get energy-price)
)

