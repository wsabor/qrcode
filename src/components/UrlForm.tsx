import { inputBase, inputBorder } from "../lib/styles";

interface Props {
  value: string;
  onChange: (v: string) => void;
  error: string;
}

export default function UrlForm({ value, onChange, error }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
        Texto ou URL
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite o texto ou URL..."
        className={`${inputBase} ${error ? "border-red-400 focus:ring-red-400" : inputBorder("indigo")}`}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
