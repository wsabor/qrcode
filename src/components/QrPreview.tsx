import type { RefObject } from "react";
import { PREVIEW_SIZE } from "../lib/qrDraw";

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  transparentBg: boolean;
  bgColor: string;
  generatedLabel: string;
  hasContent: boolean;
  pngResolution: number;
  copyStatus: "idle" | "success" | "error";
  shareStatus: "idle" | "success";
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
  onCopy: () => void;
  onSave: () => void;
  onShare: () => void;
}

export default function QrPreview({
  canvasRef, transparentBg, bgColor, generatedLabel, hasContent,
  pngResolution, copyStatus, shareStatus,
  onDownloadPNG, onDownloadSVG, onCopy, onSave, onShare,
}: Props) {
  return (
    <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/30">
      <div
        className={`rounded-2xl p-6 mb-6 ${transparentBg ? "checkerboard" : ""}`}
        style={{ backgroundColor: transparentBg ? undefined : bgColor }}
      >
        <canvas
          ref={canvasRef}
          width={PREVIEW_SIZE}
          height={PREVIEW_SIZE}
          className="block"
          style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
        />
      </div>

      {generatedLabel && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 text-center">{generatedLabel}</p>
      )}

      <div className="flex gap-3 w-full max-w-xs">
        <button
          onClick={onDownloadPNG}
          disabled={!hasContent}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-sm hover:shadow disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          PNG
        </button>
        <button
          onClick={onDownloadSVG}
          disabled={!hasContent}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-sm hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 active:bg-indigo-50 dark:active:bg-indigo-900/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          SVG
        </button>
      </div>

      <button
        onClick={onCopy}
        disabled={!hasContent}
        className={`mt-3 flex items-center justify-center gap-2 w-full max-w-xs px-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
          copyStatus === "success"
            ? "bg-emerald-500 text-white"
            : copyStatus === "error"
              ? "bg-red-500 text-white"
              : "bg-slate-700 dark:bg-slate-600 text-white hover:bg-slate-800 dark:hover:bg-slate-500 active:bg-slate-900"
        }`}
      >
        {copyStatus === "success" ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Copiado!
          </>
        ) : copyStatus === "error" ? (
          "Erro ao copiar"
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copiar imagem
          </>
        )}
      </button>

      <button
        onClick={onSave}
        disabled={!hasContent}
        className="mt-3 flex items-center justify-center gap-2 w-full max-w-xs px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-sm hover:shadow disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v4h8V3M7 21v-8h10v8" />
        </svg>
        Salvar Configuração
      </button>

      <button
        onClick={onShare}
        className={`mt-3 flex items-center justify-center gap-2 w-full max-w-xs px-4 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
          shareStatus === "success"
            ? "bg-indigo-600 text-white border-indigo-600"
            : "text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400"
        }`}
      >
        {shareStatus === "success" ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Link copiado!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Copiar link
          </>
        )}
      </button>

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 text-center">
        PNG: {pngResolution}×{pngResolution}px • SVG: vetorial escalável
      </p>
    </div>
  );
}
