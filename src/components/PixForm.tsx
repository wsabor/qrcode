import { inputBase, inputBorder } from "../lib/styles";

interface Props {
  chave: string; setChave: (v: string) => void;
  nome: string; setNome: (v: string) => void;
  cidade: string; setCidade: (v: string) => void;
  valor: string; setValor: (v: string) => void;
  descricao: string; setDescricao: (v: string) => void;
  onGenerate: () => void;
  valid: boolean;
}

export default function PixForm({
  chave, setChave, nome, setNome, cidade, setCidade,
  valor, setValor, descricao, setDescricao, onGenerate, valid,
}: Props) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Chave PIX (CPF, CNPJ, e-mail, telefone ou chave aleatória)"
        value={chave}
        onChange={(e) => setChave(e.target.value)}
        className={`${inputBase} ${inputBorder("emerald")}`}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Nome do Recebedor"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={25}
          className={`${inputBase} ${inputBorder("emerald")}`}
        />
        <input
          type="text"
          placeholder="Cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          maxLength={15}
          className={`${inputBase} ${inputBorder("emerald")}`}
        />
      </div>
      <input
        type="number"
        placeholder="Valor em R$ (opcional)"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        min="0"
        step="0.01"
        className={`${inputBase} ${inputBorder("emerald")}`}
      />
      <input
        type="text"
        placeholder="Descrição (opcional)"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        maxLength={72}
        className={`${inputBase} ${inputBorder("emerald")}`}
      />
      <button
        onClick={onGenerate}
        disabled={!valid}
        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Gerar QR Code PIX
      </button>
    </div>
  );
}
