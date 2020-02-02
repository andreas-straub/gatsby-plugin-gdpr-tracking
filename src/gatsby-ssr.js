import React from "react"

export const onRenderBody = (
  {setHeadComponents, setPostBodyComponents}, { googleAnalytics = { anonymize: true }, environments = ['production'] }
) => {
  const currentEnvironment = process.env.ENV || process.env.NODE_ENV || "development";

  if (!environments.includes(currentEnvironment)) {
    return null;
  }

  // Lighthouse recommends pre-connecting to googletagmanager
  setHeadComponents([
    <link
      rel="preconnect dns-prefetch"
      key="preconnect-googletagmanager"
      href="https://www.googletagmanager.com"
    />,
  ])

  const anonymize = typeof googleAnalytics.anonymize !== `undefined` && googleAnalytics.anonymize === true;
  const setComponents = googleAnalytics.head ? setHeadComponents : setPostBodyComponents
  return setComponents([
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics.trackingId}`}/>,
    <script
      key={`gatsby-plugin-gdpr-analytics`}
      dangerouslySetInnerHTML={{
        __html: `
        ${
          anonymize === true
            ? `function gaOptout(){document.cookie=disableStr+'=true; expires=Thu, 31 Dec 2099 23:59:59 UTC;path=/',window[disableStr]=!0}var gaProperty='${googleAnalytics.trackingId}',disableStr='ga-disable-'+gaProperty;document.cookie.indexOf(disableStr+'=true')>-1&&(window[disableStr]=!0);`
            : ``
        }
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
        `,
      }}
    />,
  ])
}