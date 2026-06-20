import { inputBase, inputBorder } from "../lib/styles";

interface Props {
  phone: string; setPhone: (v: string) => void;
  message: string; setMessage: (v: string) => void;
}

export default function WhatsAppForm({ phone, setPhone, message, setMessage }: Props) {
  return (
    <div className="space-y-3">
      <input
        type="tel"
        placeholder="Número com DDI e DDD (ex: 5511999999999)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={`${inputBase} ${inputBorder("green")}`}
      />
      <textarea
        placeholder="Mensagem pré-preenchida (opcional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className={`${inputBase} ${inputBorder("green")} resize-none`}
      />
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Apenas dígitos no número — DDI + DDD + número (ex: 5511999999999)
      </p>
    </div>
  );
}
