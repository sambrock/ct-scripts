const DESKTOP_CLIENT_ID = "463473";
const MOBILE_CLIENT_ID = "463473";
const DEFAULT_LOCALE = "en-gb";
const DEFAULT_CURRENCY = "eur";
const url = new URL(window.location.href);
const urlSegments = url.pathname.split("/").filter(Boolean);
function getDevice() {
  if (window.matchMedia("(max-width: 767px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 991px)").matches) return "tablet";
  return "desktop";
}
function getPageType() {
  const lastSegment = urlSegments.at(-1);
  if (urlSegments.some((s) => s === "loc")) return "location";
  if (lastSegment === "book") return "book";
  if (lastSegment === "minimal") return "iframe";
  if (urlSegments.length === 0 || lastSegment === undefined) return "home";
  return null;
}
function getClientId(clientId) {
  const paramClientId =
    url.searchParams.get("clientId") ||
    url.searchParams.get("client") ||
    url.searchParams.get("clientid") ||
    url.searchParams.get("clientID");
  if (paramClientId) return paramClientId;
  if (clientId) return clientId;
  const device = getDevice();
  return device === "mobile" ? MOBILE_CLIENT_ID : DESKTOP_CLIENT_ID;
}
function syncToStorage() {
  sessionStorage.setItem("ct:context", JSON.stringify(window.CtContext));
  window.dispatchEvent(new CustomEvent("ct:context:sync"));
}
window.CtContext = {
  clientId: getClientId(),
  device: getDevice(),
  pageType: getPageType(),
  otaLanguage: document.documentElement.lang,
  locale: document.documentElement.lang || DEFAULT_LOCALE,
  currency: url.searchParams.get("currency") ?? DEFAULT_CURRENCY,
  locationId: null,
  isFBE: false,
  setClientId(id) {
    this.clientId = getClientId(id);
    syncToStorage();
  },
  setDevice() {
    this.device = getDevice();
    syncToStorage();
  },
  setLocationId(id) {
    this.locationId = id;
    syncToStorage();
  },
  setIsFBE(isFBE) {
    this.isFBE = isFBE;
    syncToStorage();
  },
};
syncToStorage();
window.addEventListener("resize", function () {
  window.CtContext.setDevice();
});
window.addEventListener("CT.ABE.Settings.events.ready", function () {
  const appEl = document.querySelector("div[ct-app]");
  const isFBE = appEl ? appEl.classList.contains("ct-future-booking-engine") : false;
  window.CtContext.setIsFBE(isFBE);
});
