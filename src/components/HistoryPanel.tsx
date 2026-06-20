import type { HistoryItem } from "../types";
import { formatDate } from "../lib/utils";

interface Props {
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export default function HistoryPanel({ history, onRestore, onDelete }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="mt-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Histórico
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {history.length} {history.length === 1 ? "item salvo" : "itens salvos"}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="group relative flex gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20"
              onClick={() => onRestore(item)}
              title="Clique para restaurar esta configuração"
            >
              <div className="shrink-0">
                <img
                  src={item.thumbnail}
                  alt="QR Code"
                  className="w-16 h-16 rounded-lg border border-slate-200 dark:border-slate-700 bg-white object-contain"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate" title={item.label || item.text}>
                  {item.label || item.text}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{formatDate(item.savedAt)}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600"
                    style={{ backgroundColor: item.fgColor }}
                    title={`Cor: ${item.fgColor}`}
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600"
                    style={{ backgroundColor: item.transparentBg ? "transparent" : item.bgColor }}
                    title={`Fundo: ${item.transparentBg ? "transparente" : item.bgColor}`}
                  />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {item.errorLevel} • {item.pngResolution}px
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className="absolute top-2 right-2 p-1 rounded-lg text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                title="Remover do histórico"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
