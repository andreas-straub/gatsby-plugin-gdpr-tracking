import Cookies from "js-cookie"

const currentEnvironment = process.env.ENV || process.env.NODE_ENV || "development";

const defaultOptions = {
  environments: ["production"],
  googleAnalytics: {
    anonymize: true
  },
  googleAds: {
    controlCookieName: 'gdpr-marketing-enabled',
    anonymize: true
  },
  hotjar: {
    controlCookieName: 'gdpr-analytics-enabled',
  }
};

export const onClientEntry = (_, {hotjar}) => {
  const hotjarOpt = {...defaultOptions.hotjar, ...hotjar};

  if (typeof window.trackHotjar === `function` && Cookies.get(hotjarOpt.controlCookieName) === "true") {
    trackHotjar();
  }
};

export const onRouteUpdate = ({location}, {environments = defaultOptions.environments, googleAnalytics, googleAds}) => {
  const googleAnalyticsOpt = {...defaultOptions.googleAnalytics, ...googleAnalytics};
  const googleAdsOpt = {...defaultOptions.googleAds, ...googleAds};

  // check for the production environment
  if (!environments.includes(currentEnvironment)) {
    return null;
  }

  if (typeof window.gtag === `function`) {
    // Google Analytics
    gtag('config', googleAnalyticsOpt.trackingId, {
      'anonymize_ip': googleAnalyticsOpt.anonymize.toString(),
      'page_path': location.pathname
    });

    // - Google Ads pixel
    // check if the marketing cookie exists
    window.trackGoogleAds = () => {
      if (Cookies.get(googleAdsOpt.controlCookieName) === "true" && googleAdsOpt.trackingId) {

        console.log("trackGoogleAds", googleAdsOpt.trackingId);
        gtag('config', googleAdsOpt.trackingId, {
          'anonymize_ip': googleAdsOpt.anonymize.toString(),
          'page_path': location.pathname
        });
      }
    };
    window.trackGoogleAds();

  }

};
