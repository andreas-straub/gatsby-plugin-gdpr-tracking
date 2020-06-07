import Cookies from "js-cookie"

const currentEnvironment = process.env.ENV || process.env.NODE_ENV || "development";

const defaultOptions = {
  environments: ["production"],
  debug: false,
  googleAnalytics: {
    anonymize: true,
    controlCookieName: 'gdpr-analytics-enabled',
    autoStart: true,
    cookieFlags: 'secure;samesite=none'
  },
  googleAds: {
    controlCookieName: 'gdpr-marketing-enabled',
    anonymize: true,
    cookieFlags: 'secure;samesite=none'
  },
  hotjar: {
    controlCookieName: 'gdpr-analytics-enabled',
  }
};

export const onClientEntry = (_, {environments = defaultOptions.environments, hotjar, debug}) => {
  if (debug) {
    console.log("onClientEntry - currentEnvironment:", currentEnvironment);
  }

  // check for the production environment
  if (!environments.includes(currentEnvironment)) {
    if (debug) {
      console.log("onClientEntry - abort tracking since the environment is to configured. environments: ", environments);
    }
    return null;
  }

  const hotjarOpt = {...defaultOptions.hotjar, ...hotjar};

  if (typeof window.trackHotjar === `function` && Cookies.get(hotjarOpt.controlCookieName) === "true") {
    if (debug) {
      console.log(`onClientEntry - Cookies.get('${hotjarOpt.controlCookieName}') is true ==> start hotjar tracking`);
    }
    window.trackHotjar();
  }

  if (typeof window.gtag === `function`) {
    window.gaLoaded = false;

    if (debug) {
      console.log(`onClientEntry - gtag function is defined. gaLoaded=${gaLoaded}`);
    }
  }
};

export const onRouteUpdate = ({location}, {environments = defaultOptions.environments, googleAnalytics, googleAds, debug}) => {
  if (debug) {
    console.log("onRouteUpdate - currentEnvironment:", currentEnvironment);
  }

  // check for the production environment
  if (!environments.includes(currentEnvironment)) {
    if (debug) {
      console.log("onRouteUpdate - abort tracking since the environment is to configured. environments: ", environments);
    }
    return null;
  }

  const googleAnalyticsOpt = {...defaultOptions.googleAnalytics, ...googleAnalytics};
  const googleAdsOpt = {...defaultOptions.googleAds, ...googleAds};

  if (debug) {
    console.log(`onRouteUpdate - start tracking functions definitions`);
  }

  // Google Analytics
  window.trackGoogleAnalytics = () => {
    if (debug) {
      console.log(`onRouteUpdate - inside trackGoogleAnalytics function googleAnalytics options:`, googleAnalyticsOpt);
    }
    if ((googleAnalyticsOpt.autoStart || Cookies.get(googleAnalyticsOpt.controlCookieName) === "true") && googleAnalyticsOpt.trackingId) {

      if (debug) {
        console.log(`onRouteUpdate - inside trackGoogleAnalytics function - tracking is active!!`);
      }

      if (!window.gaLoaded) {
        if (debug) {
          console.log(`onRouteUpdate - initialize gtag with Date (gtag('js', new Date()))`);
        }
        gtag('js', new Date());
        window.gaLoaded = true;
      }
      if (debug) {
        console.log(`onRouteUpdate - gaLoaded:`, window.gaLoaded);
      }

      if (debug) {
        console.log(`onRouteUpdate - inside trackGoogleAnalytics - track page view for path: `, location.pathname);
      }
      gtag('config', googleAnalyticsOpt.trackingId, {
        'anonymize_ip': googleAnalyticsOpt.anonymize.toString(),
        'page_path': location.pathname,
        'cookie_flags': googleAnalyticsOpt.cookieFlags
      });
    } else {
      if (debug) {
        console.log(`onRouteUpdate - inside trackGoogleAnalytics function - tracking is disabled!!`);
      }
    }
  };

  window.trackGoogleAnalyticsEvent = (category, params) => {
    if ((googleAnalytics.autoStart || Cookies.get(googleAnalyticsOpt.controlCookieName) === "true") && googleAnalyticsOpt.trackingId) {
      if (debug) {
        console.log(`onRouteUpdate - inside trackGoogleAnalyticsEvent function - tracking is active!!`);
      }
      gtag('event', category, params);
    } else {
      if (debug) {
        console.log(`onRouteUpdate - inside trackGoogleAnalyticsEvent function - tracking is disabled!!`);
      }
    }
  };


  // - Google Ads pixel
  // check if the marketing cookie exists
  window.trackGoogleAds = () => {
    if (Cookies.get(googleAdsOpt.controlCookieName) === "true" && googleAdsOpt.trackingId) {
      gtag('config', googleAdsOpt.trackingId, {
        'anonymize_ip': googleAdsOpt.anonymize.toString(),
        'page_path': location.pathname,
        'cookie_flags': googleAdsOpt.cookieFlags
      });
    }
  };

  window.trackGoogleAdsEvent = (category, params) => {
    if (Cookies.get(googleAdsOpt.controlCookieName) === "true" && googleAdsOpt.trackingId) {
      gtag('event', category, params);
    }
  };


  if (debug) {
    console.log(`onRouteUpdate - call tracking functions`);
  }
  window.trackGoogleAnalytics();
  window.trackGoogleAds();

};
