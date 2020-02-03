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
            // Optional parameter (default false) - Enable analytics in development mode.
            enableDevelopment: true, // default false
            // Defines where to place the tracking script - `true` in the head and `false` in the body
            head: true,
            // Setting this parameter is optional
            anonymize: true,
            // Setting this parameter is also optional
            respectDNT: false,
            // Delays sending pageview hits on route update (in milliseconds)
            pageTransitionDelay: 0,
            // Optional parameter (default false) - Starts google analytics with cookies enabled. In some countries (such as Germany) this is not allowed.
            autoStartWithCookiesEnabled: false,
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
Note that this plugin is disabled while running `gatsby develop`. This way, actions are not tracked while you are still developing your project. Once you run `gatsby build` the plugin is enabled. Test it with `gatsby serve`.
You can use this plugin in development mode, if you set the plugin option `enableDevelopment`.

## How it works
By default this plugin starts google analytics without cookies and with a generated clientId to make it GDPR compliant. Google Analytics will be started on `onClientEntry`.
As soon as the user accepts your cookie policy, you can set the cookie `gatsby-plugin-gdpr-tracking_cookies-enabled`.
Depending on the user input the value should be `true` or `false`. 
If the cookie is set to true, Google Analytics will be restarted with enabled cookies. 
If the cookie is set to false, Google Analytics will continue without cookies.
If the user withdraws the choice, set the cookie to false and Google Analytics will be restarted in the correct mode.

The page view will be tracked on `onRouteUpdate`.

## Options

### `trackingId`

Here you place your Google Analytics tracking id.

### `adsTrackingId`

Here you place your Google Analytics tracking id.

## Optional Fields

### `enableDevelopment`

Enable analytics in development mode.

### `anonymizeIP`

Some countries (such as Germany) require you to use the
[\_anonymizeIP](https://support.google.com/analytics/answer/2763052) function for
Google Analytics. Otherwise you are not allowed to use it. 

### `autoStartWithCookiesEnabled`

Starts google analytics with cookies enabled. In some countries (such as Germany) this is not allowed.


The plugin overwrites some `gaOptions` to ensure other options like disabled cookies.

## Troubleshooting

### No actions are tracked

#### Check the tracking ID

Make sure you supplied the correct Google Analytics tracking ID. It should look like this: `trackingId: "UA-111111111-1"`
