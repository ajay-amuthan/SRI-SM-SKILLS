const DEFAULT_STORE_WHATSAPP = "919952522102";

/** Digits-only WhatsApp number with country code (no +). Set via NEXT_PUBLIC_STORE_WHATSAPP. */
export const STORE_WHATSAPP =
  process.env.NEXT_PUBLIC_STORE_WHATSAPP?.replace(/\D/g, "") ||
  DEFAULT_STORE_WHATSAPP;

export function whatsAppUrl(message: string, phone = STORE_WHATSAPP) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
