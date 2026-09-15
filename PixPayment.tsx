import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { buildPixPayload } from "../lib/pix";
import { Btn } from "./ui";

export const PixPayment = ({
  pixKey, merchantName, merchantCity, amount, txid, description,
}: {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  txid?: string;
  description?: string;
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const trimmedKey = pixKey.trim();
  const payload = trimmedKey ? buildPixPayload({ pixKey: trimmedKey, merchantName, merchantCity, amount, txid, description }) : null;

  useEffect(() => {
    let cancelled = false;
    if (!payload) {
      setQrDataUrl(null);
      return;
    }
    QRCode.toDataURL(payload, { margin: 1, width: 400, color: { dark: "#0F172A", light: "#FFFFFF" } })
      .then((url) => { if (!cancelled) setQrDataUrl(url); })
      .catch(() => { if (!cancelled) setQrDataUrl(null); });
    return () => { cancelled = true; };
  }, [payload]);

  if (!payload) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center">
        <p className="text-sm text-slate-500">Cadastre a chave Pix do motorista para gerar a cobrança.</p>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable in this context — the code below remains selectable.
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="p-5 flex flex-col items-center border-b border-dashed border-slate-200">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code para pagamento via Pix" width={180} height={180} className="rounded-lg" />
        ) : (
          <div className="w-[180px] h-[180px] rounded-lg bg-slate-100 animate-pulse" />
        )}
        <p className="text-xs text-slate-400 mt-3">Escaneie com o app do seu banco</p>
      </div>
      <div className="p-4">
        <p className="text-xs font-600 text-slate-500 mb-1.5">Pix copia e cola</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-[11px] font-mono text-slate-600 bg-slate-50 rounded-lg px-3 py-2.5 truncate">
            {payload}
          </code>
          <Btn variant="secondary" size="sm" onClick={handleCopy} className="flex-shrink-0">
            {copied ? "Copiado ✓" : "Copiar"}
          </Btn>
        </div>
      </div>
    </div>
  );
};
