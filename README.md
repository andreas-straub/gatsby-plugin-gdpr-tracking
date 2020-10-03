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
      resolve: 'gatsby-plugin-gdpr-tracking',
      options: {
        // logging to the console, if debug is true
        debug: false, 
        googleAnalytics: { 
            // The property ID; the tracking code won't be generated without it.
            trackingId: 'YOUR_GOOGLE_ANALYTICS_TRACKING_ID',
            // Defines it google analytics should be started with out the cookie consent
            autoStart: true, // <--- default
            // Setting this parameter is optional
            anonymize: true, // <--- default
            // Name of the cookie, that enables the tracking if it is true
            controlCookieName: 'gdpr-analytics-enabled', // <--- default
            cookieFlags: 'secure;samesite=none' // <--- default
        },
        googleAds: {
          // The property ID; the tracking code won't be generated without it.
          trackingId: 'YOUR_GOOGLE_ADS_TRACKING_ID',
          // Setting this parameter is optional
          anonymize: true, // <--- default
          // Name of the cookie, that enables the tracking if it is true
          controlCookieName: 'gdpr-marketing-enabled', // <--- default
          cookieFlags: 'secure;samesite=none' // <--- default
        },
        facebookPixel: {
          // The property ID; the tracking code won't be generated without it.
          pixelId: 'YOUR_FACEBOOK_PIXEL_TRACKING_ID',
          // Name of the cookie, that enables the tracking if it is true
          controlCookieName: 'gdpr-marketing-enabled', // <--- default
        },
        hotjar: {
          // The Hotjar ID; the tracking code won't be generated without it.
          trackingId: 'YOUR_HOTJAR_ID',
          // Your Hotjar snippet version
          snippetVersion: '6', // <--- default
          // Name of the cookie, that enables the tracking if it is true
          controlCookieName: 'gdpr-analytics-enabled' // <--- default
        },
        // Defines the environments where the tracking should be available  - default is ["production"]
        environments: ['production', 'development']
      },
    },
  ],
}
```

## How it works
First of all the plugin checks in which environment your site is running. If it's currently running in one of your defined
environments it will add the Google Analytics, Google Ads and Hotjar Pixel tracking code (script tags) by default to the
`<head>` of your site. It will not be activated or initialized by this.

### PLEASE NOTICE!
If the `googleAnalytics.autoStart` option is `true`, then it will start tracking to Google Analytics without user consent!
In order to be perfectly compliant to GDPR you have to set it to `false`!

### Google Analytics
If the `googleAnalytics.autoStart` option is `false`, this plugin will not send any data to Google Analytics to make it GDPR compliant.
The user first needs to accept your cookie policy. By accepting that, you need to set the cookie, that you can configure
in the option: `googleAnalytics.controlCookieName`. Depending on the user input the value of the cookies should be `true` or `false`.
Usually you have to reload the page after changing the control cookie value. But with this plugin you can simple call the 
function `window.trackGoogleAnalytics()` to start the tracking. You page view will be tracked without reloading the page.
This function still check the value of the control cookie. So you have to set it to true first and then call the function 
after the user has confirmed the consent.

#### JavaScrip API of Google Analytics
This plugin uses the new Google Analytics API that is working with Google Tag manager (`gtas.js`)
Here you can find the Google Docs: https://developers.google.com/analytics/devguides/collection/gtagjs

This plugin loads the `gtag.js` library, establishes `googleAnalytics.trackingId` as the default Google Analytics property ID, 
and sends a pageview hit to Google Analytics.

This is the code of `onRouteUpdate` method created by this plugin
```javascript
gtag(
  'config', googleAnalyticsOpt.trackingId, {
  'anonymize_ip': googleAnalyticsOpt.anonymize.toString(),
  'page_path': location.pathname
});
```

**Helper functions, that you can use in your code:**

`window.trackGoogleAnalytics()` - sends a pageview hit to Google Analytics, depending on the current value of the control cookie

`window.trackGoogleAnalyticsEvent(category, params)` - sends an event to Google Analytics, depending on the current value of the control cookie

`window.gaOptout()` - If your visitors should be able to set an Opt-Out-Cookie (No future tracking) you can set a link e.g. in your 
imprint as follows:
```html
<a href="javascript:gaOptout();">Deactivate Google Analytics</a>
```

### Google Ads and Hotjar
By default, this plugin will not send any data to Google Ads or to Hotjar to make it GDPR compliant.
The user first needs to accept your cookie policy. By accepting that you need to set cookies that you can configure
in the options: `googleAds.controlCookieName` and `hotjar.controlCookieName`.
Depending on the user input the value of each of the cookies should be `true` or `false`.

#### Hotjar
If the value of `hotjar.controlCookieName` cookie is `true`, Hotjar will be initialized `onClientEntry`. After the page reload it 
will track the page by the Hotjar library. You can also use trigger the tracking by using the helper function: 

`window.trackHotjar()` - trigger the tracking of the website by Hotjar, only if the value of the control cookie is `true`.

#### Google Ads
Sometimes you want to track the Google Ads Analytics in separate Google Ads account. Then you can activate it by setting the `trackingId`
of `googleAds` configuration object.
 
The tracking of Google Ads is very similar to Google Analytics. Basically they differ only by the tracking ID and the name of the helper functions to use.

**Helper functions, that you can use in your code:**

`window.trackGoogleAds()` - sends a pageview hit to Google Ads Analytics, depending on the current value of the control cookie

`window.trackGoogleAdsEvent(category, params)` - sends an event to Google Ads Analytics, depending on the current value of the control cookie

#### Facebook Pixel
The user first needs to accept your cookie policy. By accepting that, you need to set the cookie, that you can configure
in the option: `facebookPixel.controlCookieName`. Depending on the user input the value of the cookies should be `true` or `false`.
Usually you have to reload the page after changing the control cookie value. But with this plugin you can simple call the 
function `window.trackFbPixel()` to start the tracking. You page view will be tracked without reloading the page.
This function still check the value of the control cookie. So you have to set it to true first and then call the function 
after the user has confirmed the consent.

#### JavaScrip API of Facebook Pixel

This plugin loads the `https://connect.facebook.net/en_US/fbevents.js` library 
and sends a PageView hit to Facebook.

This is the code of `onRouteUpdate` method created by this plugin
```javascript
  fbq('track', 'PageView');
```

**Helper functions, that you can use in your code:**

`window.trackFbPixel()` - sends a pageview hit to Facebook, depending on the current value of the control cookie



### Important:
Please keep in mind setting the cookies. Otherwise, the tracking won't work! Tracking won't happen at all
if there are no cookies or they are set so false.

## Options

### Global:

#### `debug` 
Logging to the console, if this option is `true`. Default is `false`.

####  `environments`
Defines the environments where the tracking should be available. Default is `["production"]`.

### Google Analytics `googleAnalytics` configuration object:

#### `trackingId`

Here you place your Google Analytics tracking id.

#### `autoStart`

Should the tracking starts immediately without consent or not. Default is `true`. You can set it to `false` to let it 
be controlled via cookie with the name defined in `controlCookieName` option  

#### `controlCookieName`

Name of the control cookie. Needed if `autoStart` sets to `false`. If the value of this cookie it set to `true`, then 
tracking is activated

#### `anonymize`

Some countries (such as Germany) require you to use the
[\_anonymizeIP](https://support.google.com/analytics/answer/2763052) function for Google Analytics. Otherwise you are not allowed to use it.

### Google Ads Pixel `googleAds` configuration object:

#### `trackingId`

Here you place your Google Analytics tracking id.

#### `anonymize`
Some countries (such as Germany) require you to use the
[\_anonymizeIP](https://support.google.com/analytics/answer/2763052) function for Google Analytics. Otherwise you are not allowed to use it.

#### `controlCookieName`

Name of the control cookie. If the value of this cookie it set to `true`, then tracking is activated

#### `cookieFlags`

The new `cookieFlags` field allows you to set any cookie directive when the Google Analytics cookie is created.

The value of this setting is a semi-colon separated list of lowercase cookie directives and their respective values. For example, this is a possible value of cookieFlags:

`max-age=7200;domain=simoahava.com;path=/;secure;samesite=none`

The default value is: `secure;samesite=none`

See more details here: https://www.simoahava.com/analytics/cookieflags-field-google-analytics/

### Hotjar `hotjar` configuration object:

#### `trackingId`

Your Hotjar ID

#### `snippetVersion`

Your Hotjar snippet version or 6 by default

#### `controlCookieName`

Name of the control cookie. If the value of this cookie it set to `true`, then tracking is activated

### Facebook Pixel `facebookPixel` configuration object:

#### `pixelId`

Your Facebook Pixel ID

#### `controlCookieName`

Name of the control cookie. If the value of this cookie it set to `true`, then tracking is activated
