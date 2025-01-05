;; Vacuum Energy Device NFT Contract

(define-non-fungible-token vacuum-energy-device uint)

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INVALID_DEVICE (err u101))

;; Data variables
(define-data-var last-device-id uint u0)

;; Data maps
(define-map device-data
  uint
  {
    creator: principal,
    name: (string-ascii 64),
    description: (string-utf8 1024),
    efficiency: uint,
    creation-date: uint
  }
)

;; Public functions
(define-public (mint-device (name (string-ascii 64)) (description (string-utf8 1024)) (efficiency uint))
  (let
    (
      (device-id (+ (var-get last-device-id) u1))
    )
    (try! (nft-mint? vacuum-energy-device device-id tx-sender))
    (map-set device-data
      device-id
      {
        creator: tx-sender,
        name: name,
        description: description,
        efficiency: efficiency,
        creation-date: block-height
      }
    )
    (var-set last-device-id device-id)
    (ok device-id)
  )
)

(define-public (transfer-device (device-id uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (unwrap! (nft-get-owner? vacuum-energy-device device-id) ERR_INVALID_DEVICE)) ERR_NOT_AUTHORIZED)
    (try! (nft-transfer? vacuum-energy-device device-id tx-sender recipient))
    (ok true)
  )
)

;; Read-only functions
(define-read-only (get-device-data (device-id uint))
  (map-get? device-data device-id)
)

(define-read-only (get-device-owner (device-id uint))
  (nft-get-owner? vacuum-energy-device device-id)
)

(define-read-only (get-last-device-id)
  (var-get last-device-id)
)

