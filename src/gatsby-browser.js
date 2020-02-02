import Cookies from "js-cookie"

const currentEnvironment = process.env.ENV || process.env.NODE_ENV || "development";

const defaultOptions = {
  environments: ["production"],
  googleAnalytics: {
    anonymize: true
  },
  googleAds: {
    controlCookieName: 'gdpr-gAds-ctrl',
    anonymize: true
  }
};

function isEnvironmentValid(environments) {
  return environments.includes(currentEnvironment);
}

export const onClientEntry = (_, pluginOptions = {}) => {
  const {
    environments,
    googleAnalytics,
    googleAds
  } = Object.assign(defaultOptions, pluginOptions);

  // check for the correct environment
  if (isEnvironmentValid(environments)) {
    // - google analytics

    // check if the tracking function exists
    if (typeof window.gtag === `function`) {
      console.log('Google Analytics - trackingId', googleAnalytics.trackingId);
      gtag('config', googleAnalytics.trackingId, { 'anonymize_ip': googleAnalytics.anonymize.toString() });


      // - Google Ads pixel
      // check if the marketing cookie exists
      if (Cookies.get(googleAds.controlCookieName) === "true") {
        console.log('Google Ads - trackingId', googleAds.trackingId);
        gtag('config', googleAds.trackingId, { 'anonymize_ip': googleAds.anonymize.toString() });
      }
    }
  }
};

export const onRouteUpdate = ({ location }, pluginOptions = {}) => {
  const {
    environments,
    googleAnalytics,
    googleAds
  } = Object.assign(defaultOptions, pluginOptions);

  // check for the production environment
  if (!isEnvironmentValid(environments)) {
    return null;
  }

  if (typeof window.gtag === `function`) {
    // Google Analytics
    console.log('Google Analytics (onRouteUpdate) - trackingId', googleAnalytics.trackingId);
    gtag('config', googleAnalytics.trackingId, {
      'anonymize_ip': googleAnalytics.anonymize.toString(),
      'page_path': location.pathname
    });

    // - Google Ads pixel
    // check if the marketing cookie exists
    if (Cookies.get(googleAds.controlCookieName) === "true") {
      console.log('Google Ads (onRouteUpdate) - trackingId', googleAds.trackingId);
      gtag('config', googleAds.trackingId, {
        'anonymize_ip': googleAds.anonymize.toString(),
        'page_path': location.pathname
      });
    }
  }
};