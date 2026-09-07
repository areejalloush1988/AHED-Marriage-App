type NavigatorWithDeviceHints = Navigator & {
  standalone?: boolean;
  userAgentData?: {
    mobile?: boolean;
    platform?: string;
  };
};

export function isAndroidPhoneDevice() {
  if (typeof window === "undefined") return false;

  const deviceNavigator = window.navigator as NavigatorWithDeviceHints;
  const userAgent = deviceNavigator.userAgent;
  const isSamsungBrowser = /SamsungBrowser/i.test(userAgent);
  const isSamsungTabletModel = /SM-(?:T|X|P)[A-Z0-9-]*/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent)
    || deviceNavigator.userAgentData?.platform === "Android"
    || isSamsungBrowser;
  const hasTouch = deviceNavigator.maxTouchPoints > 0
    || window.matchMedia("(pointer: coarse)").matches;
  const shortestScreenSide = Math.min(window.screen.width, window.screen.height);
  const longestScreenSide = Math.max(window.screen.width, window.screen.height);
  const hasPhoneSizedScreen = shortestScreenSide <= 620 && longestScreenSide <= 1100;
  const hasMobileIdentity = /Mobile/i.test(userAgent)
    || deviceNavigator.userAgentData?.mobile === true;
  const isSamsungPhoneInDesktopMode = isSamsungBrowser
    && hasTouch
    && hasPhoneSizedScreen
    && !isSamsungTabletModel;

  return isAndroid && (hasMobileIdentity || isSamsungPhoneInDesktopMode);
}

export function isStandaloneApp() {
  if (typeof window === "undefined") return false;

  const deviceNavigator = window.navigator as NavigatorWithDeviceHints;
  return window.matchMedia("(display-mode: standalone)").matches
    || deviceNavigator.standalone === true;
}
