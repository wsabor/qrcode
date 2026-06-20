import { inputBase, inputBorder } from "../lib/styles";

interface Props {
  name: string; setName: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  company: string; setCompany: (v: string) => void;
  address: string; setAddress: (v: string) => void;
}

export default function VCardForm({ name, setName, phone, setPhone, email, setEmail, company, setCompany, address, setAddress }: Props) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Nome completo *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`${inputBase} ${inputBorder("violet")}`}
      />
      <input
        type="tel"
        placeholder="Telefone (ex: +5511999999999)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={`${inputBase} ${inputBorder("violet")}`}
      />
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`${inputBase} ${inputBorder("violet")}`}
      />
      <input
        type="text"
        placeholder="Empresa (opcional)"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className={`${inputBase} ${inputBorder("violet")}`}
      />
      <input
        type="text"
        placeholder="Endereço (opcional)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={`${inputBase} ${inputBorder("violet")}`}
      />
      <p className="text-xs text-slate-400 dark:text-slate-500">
        O QR Code gerado pode ser lido por qualquer app de contatos
      </p>
    </div>
  );
}
