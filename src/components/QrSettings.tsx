import { useRef, type ChangeEvent } from "react";
import type { ErrorLevel } from "../types";

interface Props {
  fgColor: string; setFgColor: (v: string) => void;
  bgColor: string; setBgColor: (v: string) => void;
  transparentBg: boolean; setTransparentBg: (v: boolean) => void;
  logo: string | null; setLogo: (v: string | null) => void;
  logoSize: number; setLogoSize: (v: number) => void;
  errorLevel: ErrorLevel; setErrorLevel: (v: ErrorLevel) => void;
  pngResolution: number; setPngResolution: (v: number) => void;
}

export default function QrSettings({
  fgColor, setFgColor,
  bgColor, setBgColor,
  transparentBg, setTransparentBg,
  logo, setLogo,
  logoSize, setLogoSize,
  errorLevel, setErrorLevel,
  pngResolution, setPngResolution,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLogoUpload(e: ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo((ev.target?.result as string) ?? null);
      reader.readAsDataURL(file);
    }
  }

  function removeLogo(): void {
    setLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="min-w-0">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Cor do código
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-colors shrink-0"
            />
            <input
              type="text"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="min-w-0 flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="min-w-0">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Cor do fundo
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              disabled={transparentBg}
              className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            />
            <input
              type="text"
              value={transparentBg ? "transparent" : bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              disabled={transparentBg}
              className="min-w-0 flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Transparent Background Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Fundo transparente</span>
        <button
          type="button"
          role="switch"
          aria-checked={transparentBg}
          onClick={() => setTransparentBg(!transparentBg)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
            transparentBg ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${transparentBg ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>

      {/* Error Correction Level */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Nível de correção de erro
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(["L", "M", "Q", "H"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setErrorLevel(level)}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                errorLevel === level
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
          Use H (alto) ao adicionar logo para melhor leitura
        </p>
      </div>

      {/* PNG Resolution */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Resolução do PNG
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[512, 1024, 2048, 4096].map((res) => (
            <button
              key={res}
              onClick={() => setPngResolution(res)}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                pngResolution === res
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {res}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
          Tamanho em pixels do arquivo PNG exportado
        </p>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Logo (opcional)
        </label>
        {!logo ? (
          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all group">
            <svg className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-indigo-600">
              Clique para enviar uma imagem
            </span>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <img src={logo} alt="Logo" className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">Logo carregado</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Tamanho: {logoSize}%</p>
              </div>
              <button
                onClick={removeLogo}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                title="Remover logo"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <label className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Tamanho do logo</span>
                <span className="font-mono">{logoSize}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="40"
                value={logoSize}
                onChange={(e) => setLogoSize(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
