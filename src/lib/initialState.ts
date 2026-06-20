import type { ErrorLevel, Mode, WifiSecurity } from "../types";
import { buildPixPayload } from "../pixPayload";

export const INITIAL = (() => {
  const p = new URLSearchParams(window.location.search);
  const mode = (p.get("m") as Mode) ?? "url";
  const pixChave = p.get("px_k") ?? "";
  const pixNome = p.get("px_n") ?? "";
  const pixCidade = p.get("px_c") ?? "";
  const pixValor = p.get("px_v") ?? "";
  const pixDescricao = p.get("px_d") ?? "";

  let qrContent = "";
  let generatedLabel = "";
  if (mode === "pix" && pixChave && pixNome && pixCidade) {
    try {
      qrContent = buildPixPayload({
        chave: pixChave,
        nome: pixNome,
        cidade: pixCidade,
        valor: pixValor,
        descricao: pixDescricao,
      });
      const valorStr =
        pixValor && parseFloat(pixValor) > 0
          ? ` — R$ ${parseFloat(pixValor).toFixed(2).replace(".", ",")}`
          : "";
      generatedLabel = `PIX: ${pixNome.trim()}${valorStr}`;
    } catch {
      /* ignore invalid PIX payload on load */
    }
  }

  const darkMode = localStorage.getItem("dark-mode") === "1";
  if (darkMode) document.documentElement.classList.add("dark");

  return {
    mode,
    urlInput: p.get("url") ?? "",
    fgColor: p.get("fg") ?? "#000000",
    bgColor: p.get("bg") ?? "#ffffff",
    transparentBg: p.get("transp") === "1",
    errorLevel: (p.get("err") as ErrorLevel) ?? "H",
    pixChave,
    pixNome,
    pixCidade,
    pixValor,
    pixDescricao,
    wifiSsid: p.get("wf_s") ?? "",
    wifiPassword: p.get("wf_p") ?? "",
    wifiSecurity: (p.get("wf_t") as WifiSecurity) ?? "WPA",
    wifiHidden: p.get("wf_h") === "1",
    vcardName: p.get("vc_n") ?? "",
    vcardPhone: p.get("vc_p") ?? "",
    vcardEmail: p.get("vc_e") ?? "",
    vcardCompany: p.get("vc_c") ?? "",
    vcardAddress: p.get("vc_a") ?? "",
    waPhone: p.get("wa_p") ?? "",
    waMessage: p.get("wa_m") ?? "",
    qrContent,
    generatedLabel,
    darkMode,
  };
})();
