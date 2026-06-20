import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import QRCode from "qrcode";
import { buildPixPayload } from "./pixPayload";
import type { ErrorLevel, Mode, WifiSecurity, HistoryItem } from "./types";
import { genId, escapeWifi, buildVCard } from "./lib/utils";
import { loadHistory, saveHistory } from "./lib/history";
import { INITIAL } from "./lib/initialState";
import { drawQRWithLogo, PREVIEW_SIZE } from "./lib/qrDraw";
import UrlForm from "./components/UrlForm";
import PixForm from "./components/PixForm";
import WifiForm from "./components/WifiForm";
import VCardForm from "./components/VCardForm";
import WhatsAppForm from "./components/WhatsAppForm";
import QrSettings from "./components/QrSettings";
import QrPreview from "./components/QrPreview";
import HistoryPanel from "./components/HistoryPanel";

function App() {
  const [mode, setMode] = useState<Mode>(INITIAL.mode);

  const [urlInput, setUrlInput] = useState(INITIAL.urlInput);

  const [pixChave, setPixChave] = useState(INITIAL.pixChave);
  const [pixNome, setPixNome] = useState(INITIAL.pixNome);
  const [pixCidade, setPixCidade] = useState(INITIAL.pixCidade);
  const [pixValor, setPixValor] = useState(INITIAL.pixValor);
  const [pixDescricao, setPixDescricao] = useState(INITIAL.pixDescricao);

  const [wifiSsid, setWifiSsid] = useState(INITIAL.wifiSsid);
  const [wifiPassword, setWifiPassword] = useState(INITIAL.wifiPassword);
  const [wifiSecurity, setWifiSecurity] = useState<WifiSecurity>(INITIAL.wifiSecurity);
  const [wifiHidden, setWifiHidden] = useState(INITIAL.wifiHidden);

  const [vcardName, setVcardName] = useState(INITIAL.vcardName);
  const [vcardPhone, setVcardPhone] = useState(INITIAL.vcardPhone);
  const [vcardEmail, setVcardEmail] = useState(INITIAL.vcardEmail);
  const [vcardCompany, setVcardCompany] = useState(INITIAL.vcardCompany);
  const [vcardAddress, setVcardAddress] = useState(INITIAL.vcardAddress);

  const [waPhone, setWaPhone] = useState(INITIAL.waPhone);
  const [waMessage, setWaMessage] = useState(INITIAL.waMessage);

  // PIX content is the only mode driven by an explicit button click
  const [pixQrContent, setPixQrContent] = useState(INITIAL.qrContent);
  const [pixLabel, setPixLabel] = useState(INITIAL.generatedLabel);

  const qrContent = useMemo(() => {
    switch (mode) {
      case "url": return urlInput;
      case "pix": return pixQrContent;
      case "wifi": {
        if (!wifiSsid.trim()) return "";
        return `WIFI:T:${wifiSecurity};S:${escapeWifi(wifiSsid)};P:${escapeWifi(wifiPassword)};H:${wifiHidden ? "true" : "false"};;`;
      }
      case "vcard":
        if (!vcardName.trim()) return "";
        return buildVCard(vcardName, vcardPhone, vcardEmail, vcardCompany, vcardAddress);
      case "whatsapp": {
        const digits = waPhone.replace(/\D/g, "");
        if (!digits) return "";
        return `https://wa.me/${digits}${waMessage.trim() ? `?text=${encodeURIComponent(waMessage)}` : ""}`;
      }
    }
  }, [mode, urlInput, pixQrContent, wifiSsid, wifiSecurity, wifiPassword, wifiHidden, vcardName, vcardPhone, vcardEmail, vcardCompany, vcardAddress, waPhone, waMessage]);

  const generatedLabel = useMemo(() => {
    switch (mode) {
      case "pix": return pixLabel;
      case "wifi": return wifiSsid.trim() ? `Wi-Fi: ${wifiSsid}` : "";
      case "vcard": return vcardName.trim() ? `Contato: ${vcardName}` : "";
      case "whatsapp": {
        const digits = waPhone.replace(/\D/g, "");
        return digits ? `WhatsApp: +${digits}` : "";
      }
      default: return "";
    }
  }, [mode, pixLabel, wifiSsid, vcardName, waPhone]);

  const [fgColor, setFgColor] = useState(INITIAL.fgColor);
  const [bgColor, setBgColor] = useState(INITIAL.bgColor);
  const [transparentBg, setTransparentBg] = useState(INITIAL.transparentBg);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(20);
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>(INITIAL.errorLevel);
  const [pngResolution, setPngResolution] = useState(1024);

  const [darkMode, setDarkMode] = useState(INITIAL.darkMode);
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const [shareStatus, setShareStatus] = useState<"idle" | "success">("idle");

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("dark-mode", darkMode ? "1" : "0");
  }, [darkMode]);

  useEffect(() => {
    const p = new URLSearchParams();
    if (mode !== "url") p.set("m", mode);
    if (mode === "url" && urlInput) p.set("url", urlInput);
    if (fgColor !== "#000000") p.set("fg", fgColor);
    if (bgColor !== "#ffffff") p.set("bg", bgColor);
    if (transparentBg) p.set("transp", "1");
    if (errorLevel !== "H") p.set("err", errorLevel);
    if (mode === "pix") {
      if (pixChave) p.set("px_k", pixChave);
      if (pixNome) p.set("px_n", pixNome);
      if (pixCidade) p.set("px_c", pixCidade);
      if (pixValor) p.set("px_v", pixValor);
      if (pixDescricao) p.set("px_d", pixDescricao);
    } else if (mode === "wifi") {
      if (wifiSsid) p.set("wf_s", wifiSsid);
      if (wifiPassword) p.set("wf_p", wifiPassword);
      if (wifiSecurity !== "WPA") p.set("wf_t", wifiSecurity);
      if (wifiHidden) p.set("wf_h", "1");
    } else if (mode === "vcard") {
      if (vcardName) p.set("vc_n", vcardName);
      if (vcardPhone) p.set("vc_p", vcardPhone);
      if (vcardEmail) p.set("vc_e", vcardEmail);
      if (vcardCompany) p.set("vc_c", vcardCompany);
      if (vcardAddress) p.set("vc_a", vcardAddress);
    } else if (mode === "whatsapp") {
      if (waPhone) p.set("wa_p", waPhone);
      if (waMessage) p.set("wa_m", waMessage);
    }
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [
    mode, urlInput, fgColor, bgColor, transparentBg, errorLevel,
    pixChave, pixNome, pixCidade, pixValor, pixDescricao,
    wifiSsid, wifiPassword, wifiSecurity, wifiHidden,
    vcardName, vcardPhone, vcardEmail, vcardCompany, vcardAddress,
    waPhone, waMessage,
  ]);

  const draw = useCallback(
    (canvas: HTMLCanvasElement, size: number) =>
      drawQRWithLogo(canvas, size, { qrContent, fgColor, bgColor, transparentBg, logo, logoSize, errorLevel }),
    [qrContent, fgColor, bgColor, transparentBg, logo, logoSize, errorLevel],
  );

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (canvas) {
      canvas.width = PREVIEW_SIZE;
      canvas.height = PREVIEW_SIZE;
      draw(canvas, PREVIEW_SIZE);
    }
  }, [draw]);

  const handleModeChange = (newMode: Mode): void => {
    setMode(newMode);
    setPixQrContent("");
    setPixLabel("");
    if (newMode === "url") setUrlInput("");
  };

  const handleGeneratePix = (): void => {
    if (!pixChave.trim() || !pixNome.trim() || !pixCidade.trim()) return;
    const payload = buildPixPayload({
      chave: pixChave, nome: pixNome, cidade: pixCidade, valor: pixValor, descricao: pixDescricao,
    });
    setPixQrContent(payload);
    const valorStr =
      pixValor && parseFloat(pixValor) > 0
        ? ` — R$ ${parseFloat(pixValor).toFixed(2).replace(".", ",")}`
        : "";
    setPixLabel(`PIX: ${pixNome.trim()}${valorStr}`);
  };

  async function handleDownloadPNG(): Promise<void> {
    if (!qrContent.trim()) return;
    const canvas = document.createElement("canvas");
    canvas.width = pngResolution;
    canvas.height = pngResolution;
    await draw(canvas, pngResolution);
    const link = document.createElement("a");
    link.download = `qrcode-${mode}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function handleDownloadSVG(): Promise<void> {
    if (!qrContent.trim()) return;
    try {
      const svgString = await QRCode.toString(qrContent, {
        type: "svg",
        width: pngResolution,
        margin: 2,
        color: { dark: fgColor, light: transparentBg ? "#00000000" : bgColor },
        errorCorrectionLevel: errorLevel,
      });

      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
      const svgEl = svgDoc.documentElement;

      if (transparentBg) {
        svgEl.querySelectorAll("rect").forEach((rect) => {
          const fill = rect.getAttribute("fill");
          if (fill === "#00000000" || fill === "transparent") rect.remove();
        });
        svgEl.querySelectorAll("path").forEach((path) => {
          const fill = path.getAttribute("fill");
          if (fill === "#00000000" || fill === "transparent") path.remove();
        });
      }

      if (logo) {
        const logoSizePx = (pngResolution * logoSize) / 100;
        const x = (pngResolution - logoSizePx) / 2;
        const y = (pngResolution - logoSizePx) / 2;
        const padding = logoSizePx * 0.1;
        const radius = 8 * (pngResolution / PREVIEW_SIZE);

        const bgRect = svgDoc.createElementNS("http://www.w3.org/2000/svg", "rect");
        bgRect.setAttribute("x", String(x - padding));
        bgRect.setAttribute("y", String(y - padding));
        bgRect.setAttribute("width", String(logoSizePx + padding * 2));
        bgRect.setAttribute("height", String(logoSizePx + padding * 2));
        bgRect.setAttribute("rx", String(radius));
        bgRect.setAttribute("ry", String(radius));
        bgRect.setAttribute("fill", transparentBg ? "rgba(255,255,255,0.95)" : bgColor);
        svgEl.appendChild(bgRect);

        const defs = svgDoc.createElementNS("http://www.w3.org/2000/svg", "defs");
        const clipPath = svgDoc.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        clipPath.setAttribute("id", "logo-clip");
        const clipRect = svgDoc.createElementNS("http://www.w3.org/2000/svg", "rect");
        clipRect.setAttribute("x", String(x));
        clipRect.setAttribute("y", String(y));
        clipRect.setAttribute("width", String(logoSizePx));
        clipRect.setAttribute("height", String(logoSizePx));
        clipRect.setAttribute("rx", String(radius * 0.7));
        clipRect.setAttribute("ry", String(radius * 0.7));
        clipPath.appendChild(clipRect);
        defs.appendChild(clipPath);
        svgEl.insertBefore(defs, svgEl.firstChild);

        const image = svgDoc.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("x", String(x));
        image.setAttribute("y", String(y));
        image.setAttribute("width", String(logoSizePx));
        image.setAttribute("height", String(logoSizePx));
        image.setAttribute("href", logo);
        image.setAttribute("clip-path", "url(#logo-clip)");
        svgEl.appendChild(image);
      }

      const finalSvg = new XMLSerializer().serializeToString(svgEl);
      const blob = new Blob([finalSvg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `qrcode-${mode}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      // Invalid QR data, ignore
    }
  }

  async function handleCopyToClipboard(): Promise<void> {
    if (!qrContent.trim()) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = PREVIEW_SIZE;
      canvas.height = PREVIEW_SIZE;
      await draw(canvas, PREVIEW_SIZE);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
          "image/png",
        );
      });
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  }

  async function handleSaveToHistory(): Promise<void> {
    if (!qrContent.trim()) return;
    const thumbCanvas = document.createElement("canvas");
    thumbCanvas.width = 128;
    thumbCanvas.height = 128;
    await draw(thumbCanvas, 128);
    const thumbnail = thumbCanvas.toDataURL("image/png");

    const item: HistoryItem = {
      id: genId(),
      mode,
      text: qrContent,
      label: generatedLabel || qrContent,
      fgColor, bgColor, transparentBg, logo, logoSize, errorLevel, pngResolution,
      thumbnail,
      savedAt: new Date().toISOString(),
      ...(mode === "wifi" && { wifiSsid, wifiPassword, wifiSecurity, wifiHidden }),
      ...(mode === "vcard" && { vcardName, vcardPhone, vcardEmail, vcardCompany, vcardAddress }),
      ...(mode === "whatsapp" && { waPhone, waMessage }),
    };

    const updated = [item, ...history];
    setHistory(updated);
    saveHistory(updated);
  }

  async function handleShareLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("success");
      setTimeout(() => setShareStatus("idle"), 2000);
    } catch {
      /* clipboard API not available */
    }
  }

  function restoreFromHistory(item: HistoryItem): void {
    setMode(item.mode);
    setFgColor(item.fgColor);
    setBgColor(item.bgColor);
    setTransparentBg(item.transparentBg);
    setLogo(item.logo);
    setLogoSize(item.logoSize);
    setErrorLevel(item.errorLevel);
    setPngResolution(item.pngResolution);
    if (item.mode === "url") {
      setUrlInput(item.text);
    } else if (item.mode === "pix") {
      setPixQrContent(item.text);
      setPixLabel(item.label);
    } else if (item.mode === "wifi") {
      setWifiSsid(item.wifiSsid ?? "");
      setWifiPassword(item.wifiPassword ?? "");
      setWifiSecurity(item.wifiSecurity ?? "WPA");
      setWifiHidden(item.wifiHidden ?? false);
    } else if (item.mode === "vcard") {
      setVcardName(item.vcardName ?? "");
      setVcardPhone(item.vcardPhone ?? "");
      setVcardEmail(item.vcardEmail ?? "");
      setVcardCompany(item.vcardCompany ?? "");
      setVcardAddress(item.vcardAddress ?? "");
    } else if (item.mode === "whatsapp") {
      setWaPhone(item.waPhone ?? "");
      setWaMessage(item.waMessage ?? "");
    }
  }

  function deleteFromHistory(id: string): void {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    saveHistory(updated);
  }

  const urlError =
    mode === "url" && /^https?:\/\//i.test(urlInput)
      ? (() => {
          try {
            new URL(urlInput);
            return "";
          } catch {
            return "URL inválida — verifique o endereço";
          }
        })()
      : "";

  const pixValid = Boolean(pixChave.trim() && pixNome.trim() && pixCidade.trim());
  const hasContent = Boolean(qrContent.trim());

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-start justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-4xl">
        <div className="relative text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Gerador de QR Code
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Gere QR Codes personalizados com logo, cores e fundo transparente
          </p>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute right-0 top-0 p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
            title={darkMode ? "Modo claro" : "Modo escuro"}
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            {(
              [
                { id: "url", label: "URL", active: "text-indigo-600 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30" },
                { id: "pix", label: "PIX", active: "text-emerald-600 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30" },
                { id: "wifi", label: "Wi-Fi", active: "text-blue-600 border-blue-600 bg-blue-50/50 dark:bg-blue-950/30" },
                { id: "vcard", label: "Contato", active: "text-violet-600 border-violet-600 bg-violet-50/50 dark:bg-violet-950/30" },
                { id: "whatsapp", label: "WhatsApp", active: "text-green-600 border-green-600 bg-green-50/50 dark:bg-green-950/30" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleModeChange(tab.id)}
                className={`flex-1 shrink-0 py-3.5 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap px-2 ${
                  mode === tab.id
                    ? tab.active
                    : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700">
              {mode === "url" && <UrlForm value={urlInput} onChange={setUrlInput} error={urlError} />}
              {mode === "pix" && (
                <PixForm
                  chave={pixChave} setChave={setPixChave}
                  nome={pixNome} setNome={setPixNome}
                  cidade={pixCidade} setCidade={setPixCidade}
                  valor={pixValor} setValor={setPixValor}
                  descricao={pixDescricao} setDescricao={setPixDescricao}
                  onGenerate={handleGeneratePix}
                  valid={pixValid}
                />
              )}
              {mode === "wifi" && (
                <WifiForm
                  ssid={wifiSsid} setSsid={setWifiSsid}
                  password={wifiPassword} setPassword={setWifiPassword}
                  security={wifiSecurity} setSecurity={setWifiSecurity}
                  hidden={wifiHidden} setHidden={setWifiHidden}
                />
              )}
              {mode === "vcard" && (
                <VCardForm
                  name={vcardName} setName={setVcardName}
                  phone={vcardPhone} setPhone={setVcardPhone}
                  email={vcardEmail} setEmail={setVcardEmail}
                  company={vcardCompany} setCompany={setVcardCompany}
                  address={vcardAddress} setAddress={setVcardAddress}
                />
              )}
              {mode === "whatsapp" && (
                <WhatsAppForm
                  phone={waPhone} setPhone={setWaPhone}
                  message={waMessage} setMessage={setWaMessage}
                />
              )}
              <QrSettings
                fgColor={fgColor} setFgColor={setFgColor}
                bgColor={bgColor} setBgColor={setBgColor}
                transparentBg={transparentBg} setTransparentBg={setTransparentBg}
                logo={logo} setLogo={setLogo}
                logoSize={logoSize} setLogoSize={setLogoSize}
                errorLevel={errorLevel} setErrorLevel={setErrorLevel}
                pngResolution={pngResolution} setPngResolution={setPngResolution}
              />
            </div>

            <QrPreview
              canvasRef={previewCanvasRef}
              transparentBg={transparentBg}
              bgColor={bgColor}
              generatedLabel={generatedLabel}
              hasContent={hasContent}
              pngResolution={pngResolution}
              copyStatus={copyStatus}
              shareStatus={shareStatus}
              onDownloadPNG={handleDownloadPNG}
              onDownloadSVG={handleDownloadSVG}
              onCopy={handleCopyToClipboard}
              onSave={handleSaveToHistory}
              onShare={handleShareLink}
            />
          </div>
        </div>

        <HistoryPanel
          history={history}
          onRestore={restoreFromHistory}
          onDelete={deleteFromHistory}
        />

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          Gerado no navegador • Nenhum dado é enviado para servidores
        </p>
      </div>
    </div>
  );
}

export default App;
