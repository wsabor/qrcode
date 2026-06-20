import type { WifiSecurity } from "../types";
import { inputBase, inputBorder } from "../lib/styles";

interface Props {
  ssid: string; setSsid: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  security: WifiSecurity; setSecurity: (v: WifiSecurity) => void;
  hidden: boolean; setHidden: (v: boolean) => void;
}

export default function WifiForm({ ssid, setSsid, password, setPassword, security, setSecurity, hidden, setHidden }: Props) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Nome da rede (SSID)"
        value={ssid}
        onChange={(e) => setSsid(e.target.value)}
        className={`${inputBase} ${inputBorder("blue")}`}
      />
      <input
        type="text"
        placeholder="Senha da rede"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`${inputBase} ${inputBorder("blue")}`}
      />
      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
          Tipo de segurança
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["WPA", "WEP", "nopass"] as const).map((sec) => (
            <button
              key={sec}
              onClick={() => setSecurity(sec)}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                security === sec
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {sec === "nopass" ? "Aberta" : sec}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Rede oculta</span>
        <button
          type="button"
          role="switch"
          aria-checked={hidden}
          onClick={() => setHidden(!hidden)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
            hidden ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${hidden ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>
    </div>
  );
}
