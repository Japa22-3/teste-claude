// ─── Pix "Copia e Cola" (BR Code) generator ────────────────────────────────
// Implements the Banco Central do Brasil BR Code spec (EMV QR Code for
// Payment Systems, Pix arrangement). This runs entirely client-side: no
// gateway, no API key, no merchant account setup. Money still moves
// bank-to-bank the normal Pix way — this only encodes "pay this key this
// amount" into the standard string any banking app already knows how to read.
//
// Spec reference (field IDs): 00 payload format, 01 point-of-initiation,
// 26 merchant account info (00 GUI, 01 Pix key, 02 description), 52 MCC,
// 53 currency (986=BRL), 54 amount, 58 country, 59 name, 60 city,
// 62 additional data (05 reference label), 63 CRC16 checksum.
//
// The CRC16 implementation below is CRC-16/CCITT-FALSE (poly 0x1021, init
// 0xFFFF, no reflection) as required by the spec, verified against the
// standard test vector CRC16("123456789") === "29B1".

function tlv(id: string, value: string): string {
  const length = value.length.toString().padStart(2, "0");
  return `${id}${length}${value}`;
}

function stripAccents(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "");
}

function crc16CcittFalse(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export interface PixChargeInput {
  /** CPF/CNPJ, email, phone (E.164, e.g. "+5511999998888") or random (EVP) key. */
  pixKey: string;
  /** Receiver's name as it should appear in the payer's banking app. */
  merchantName: string;
  merchantCity: string;
  /** Omit to let the payer type the amount themselves. */
  amount?: number;
  /** Short alphanumeric reference, e.g. "MENS082026". Falls back to "***". */
  txid?: string;
  description?: string;
}

export function buildPixPayload(input: PixChargeInput): string {
  const merchantAccountInfo = tlv(
    "26",
    tlv("00", "br.gov.bcb.pix") +
      tlv("01", input.pixKey.trim()) +
      (input.description ? tlv("02", stripAccents(input.description).slice(0, 60)) : ""),
  );

  const txid = (input.txid ? input.txid.replace(/[^a-zA-Z0-9]/g, "") : "").slice(0, 25) || "***";

  let payload =
    tlv("00", "01") +
    tlv("01", "11") + // static/reusable point of initiation
    merchantAccountInfo +
    tlv("52", "0000") + // MCC, unclassified
    tlv("53", "986") + // BRL
    (input.amount != null ? tlv("54", input.amount.toFixed(2)) : "") +
    tlv("58", "BR") +
    tlv("59", stripAccents(input.merchantName).toUpperCase().slice(0, 25) || "RECEBEDOR") +
    tlv("60", stripAccents(input.merchantCity).toUpperCase().slice(0, 15) || "BRASIL") +
    tlv("62", tlv("05", txid));

  payload += "6304"; // CRC field id + fixed length, placeholder before checksum
  return payload + crc16CcittFalse(payload);
}
