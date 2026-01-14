/** 是否为开发环境 */
export const isDev = import.meta.env.MODE === "development" || import.meta.env.DEV;

/** 系统判断 */
export const userAgent = window.navigator.userAgent;

/** 是否为 Windows 系统 */
export const isWin = userAgent.includes("Windows");
/** 是否为 macOS 系统 */
export const isMac = userAgent.includes("Macintosh");
/** 是否为 Linux 系统 */
export const isLinux = userAgent.includes("Linux");
/** 是否为 Electron 环境 */
export const isElectron = userAgent.includes("Electron") || typeof window?.electron !== "undefined";
/** 是否为 Capacitor 环境 */
export const isCapacitor = typeof window?.Capacitor !== "undefined";
/** 是否为 iOS 系统 */
export const isIOS = userAgent.includes("iPhone") || userAgent.includes("iPad") || userAgent.includes("iPod");
/** 是否为 Android 系统 */
export const isAndroid = userAgent.includes("Android");
/** 是否为移动端 */
export const isMobile = isIOS || isAndroid || /webOS|BlackBerry|IEMobile|Opera Mini/i.test(
  userAgent,
);
/** 是否为桌面端 */
export const isDesktop = isElectron || (!isMobile && !isCapacitor);

/** 是否为 DEV 构建 */
export const isDevBuild = import.meta.env.VITE_BUILD_TYPE === "dev";
