# gatsby-plugin-gdpr-tracking
Gatsby plugin to add analytics services like Google Analytics, Hotjar or Google Ads GDPR compliant.

## Install

`npm install --save gatsby-plugin-gdpr-tracking`

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-gdpr-tracking`,
      options: {
        googleAnalytics: { 
            // The property ID; the tracking code won't be generated without it.
            trackingId: "YOUR_GOOGLE_ANALYTICS_TRACKING_ID",
            // Defines where to place the tracking script - `true` in the head and `false` in the body
            head: true,
            // Setting this parameter is optional
            anonymize: true,
        },
        googleAds: {
          // The property ID; the tracking code won't be generated without it.
          trackingId: "YOUR_GOOGLE_ADS_TRACKING_ID",
          // Setting this parameter is optional
          anonymize: true,
          // name of the cookie, that enabled the traking if it set to true
          controlCookieName: "YOUR_GDPR_COOKIE_NAME"
        },
        hotjar: {
          // The Hotjar ID; the tracking code won't be generated without it.
          trackingId: "YOUR_HOTJAR_ID",
          snippetVersion: "YOUR_HOTJAR_SNIPPET_VERSION",
          // name of the cookie, that enabled the traking if it set to true
          controlCookieName: "YOUR_GDPR_COOKIE_NAME"
        },
        // Defines the environments where the tracking should be available  - default is ["production"]
        environments: ['production', 'development']
      },
    },
  ],
}
```

## How it works
This plugin uses the new Google Analytics API that is working with Google Tag manager (`gtas.js`)

Here you can find the Google Docs: https://developers.google.com/analytics/devguides/collection/gtagjs

First of all the plugin checks in which environment your site is running. If it's currently running in one of your defined
environments it will add the Google Analytics, Google Ads and Hotjar Pixel javascript by default to the `<head>` of your site.
It will not be activated or initialized by this.

The Google Analytics set the cookie and tracks the website, since it a necessary functionality to be able to host the website properly.

By default this plugin will not send any data to Google Ads or to Hotjar to make it GDPR compliant.
The user first needs to accept your cookie policy. By accepting that you need to set cookies that you can configure
in the options - `googleAds.controlCookieName` and `hotjar.controlCookieName`.
Depending on the user input the value of each of the cookies should be `true` or `false`.

If the `hotjar.controlCookieName` cookie is set to true, Hotjar will be initialized `onClientEntry`.

The page view will then be tracked on `onRouteUpdate`.

__Important:__ Please keep in mind to set the cookies. Otherwise the tracking won't work! Tracking won't happen at all
if there are no cookies or they are set so false.

## Options

### Google Analytics

#### `trackingId`

Here you place your Google Analytics tracking id.

### `head`

Should the script be added to the `<head/>` element or not.

#### `anonymize`

Some countries (such as Germany) require you to use the
[\_anonymizeIP](https://support.google.com/analytics/answer/2763052) function for Google Analytics. Otherwise you are not allowed to use it. The option adds two blocks to the code:

```javascript
gtag(
  'config', googleAnalyticsOpt.trackingId, {
  'anonymize_ip': googleAnalyticsOpt.anonymize.toString(),
  'page_path': location.pathname
});
```

If your visitors should be able to set an Opt-Out-Cookie (No future tracking)
you can set a link e.g. in your imprint as follows:

`<a href="javascript:gaOptout();">Deactivate Google Analytics</a>`

### Google Ads Pixel

#### `trackingId`

Here you place your Google Analytics tracking id.

#### `anonymize`
Some countries (such as Germany) require you to use the
[\_anonymizeIP](https://support.google.com/analytics/answer/2763052) function for Google Analytics. Otherwise you are not allowed to use it. The option adds two blocks to the code:


### Hotjar

#### `trackingId`

Your Hotjar ID

#### `snippetVersion`

Your Hotjar snippet version or 6 by default
