import { useRef, useState, type ChangeEvent } from "react";
import type { HistoryItem } from "../types";
import { formatDate } from "../lib/utils";

interface Props {
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onImport: (items: HistoryItem[]) => void;
}

export default function HistoryPanel({ history, onRestore, onDelete, onImport }: Props) {
  const importRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");

  function handleExport(): void {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "qrcode-history.json";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e: ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!Array.isArray(parsed) || parsed.some((item) => !item.id || !item.mode || !item.text)) {
          throw new Error("invalid");
        }
        onImport(parsed as HistoryItem[]);
        setImportStatus("success");
        setTimeout(() => setImportStatus("idle"), 2500);
      } catch {
        setImportStatus("error");
        setTimeout(() => setImportStatus("idle"), 2500);
      } finally {
        if (importRef.current) importRef.current.value = "";
      }
    };
    reader.readAsText(file);
  }

  if (history.length === 0) return (
    <div className="mt-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6 sm:p-8 flex items-center justify-between">
        <span className="text-sm text-slate-400 dark:text-slate-500">Nenhum item salvo ainda.</span>
        <ImportButton importRef={importRef} importStatus={importStatus} onImportFile={handleImportFile} />
      </div>
    </div>
  );

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
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">
              {history.length} {history.length === 1 ? "item" : "itens"}
            </span>
            <ImportButton importRef={importRef} importStatus={importStatus} onImportFile={handleImportFile} />
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              title="Exportar histórico como JSON"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar
            </button>
          </div>
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

interface ImportButtonProps {
  importRef: React.RefObject<HTMLInputElement | null>;
  importStatus: "idle" | "success" | "error";
  onImportFile: (e: ChangeEvent<HTMLInputElement>) => void;
}

function ImportButton({ importRef, importStatus, onImportFile }: ImportButtonProps) {
  return (
    <label
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
        importStatus === "success"
          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
          : importStatus === "error"
            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            : "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
      }`}
      title="Importar histórico de um arquivo JSON"
    >
      {importStatus === "success" ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Importado!
        </>
      ) : importStatus === "error" ? (
        "Arquivo inválido"
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Importar
        </>
      )}
      <input ref={importRef} type="file" accept=".json,application/json" onChange={onImportFile} className="hidden" />
    </label>
  );
}
