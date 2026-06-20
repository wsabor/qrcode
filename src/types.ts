export type ErrorLevel = "L" | "M" | "Q" | "H";
export type Mode = "url" | "pix" | "wifi" | "vcard" | "whatsapp";
export type WifiSecurity = "WPA" | "WEP" | "nopass";

export interface HistoryItem {
  id: string;
  mode: Mode;
  text: string;
  label: string;
  fgColor: string;
  bgColor: string;
  transparentBg: boolean;
  logo: string | null;
  logoSize: number;
  errorLevel: ErrorLevel;
  pngResolution: number;
  thumbnail: string;
  savedAt: string;
  wifiSsid?: string;
  wifiPassword?: string;
  wifiSecurity?: WifiSecurity;
  wifiHidden?: boolean;
  vcardName?: string;
  vcardPhone?: string;
  vcardEmail?: string;
  vcardCompany?: string;
  vcardAddress?: string;
  waPhone?: string;
  waMessage?: string;
}
