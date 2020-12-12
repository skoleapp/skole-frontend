import { useTheme } from '@material-ui/core';
import { GAScript } from 'lib';
import Head from 'next/head';
import React from 'react';
import { SEOProps } from 'types';

export const HeadComponent: React.FC<SEOProps> = ({ title: customTitle, description }) => {
  const { palette } = useTheme();
  const title = customTitle ? `Skole | ${customTitle}` : 'Skole';
  const keywords = 'study materials, distance learning, university'; // TODO: Optimize and translate these.

  const renderCommonMetaTags = (
    <>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
      />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <title>{title}</title>
    </>
  );

  const renderAndroidMetaTags = (
    <>
      <meta name="application-name" content="Skole" />
      <meta name="theme-color" content={palette.primary.main} />
      <meta content="yes" name="mobile-web-app-capable" />
    </>
  );

  const renderIosMetaTags = (
    <>
      <meta name="apple-mobile-web-app-title" content="Skole" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </>
  );

  const renderTwitterMetaTags = (
    <>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content="@skoleofficial" />
    </>
  );

  // TODO: Add og:image tag.
  const renderOgMetaTags = (
    <>
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Skole" />
    </>
  );

  const renderLinkTags = (
    <>
      <link rel="shortcut icon" href="/images/icons/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/icon-180x180.png" />
      <link
        rel="mask-icon"
        href="/images/icons/safari-pinned-tab.svg"
        color={palette.primary.main}
      />
      <link
        href="/images/splashscreens/iphone5_splash.png"
        media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/images/splashscreens/iphone6_splash.png"
        media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/images/splashscreens/iphoneplus_splash.png"
        media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/images/splashscreens/iphonex_splash.png"
        media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/images/splashscreens/iphonexr_splash.png"
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/images/splashscreens/iphonexsmax_splash.png"
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/images/splashscreens/ipad_splash.png"
        media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/images/splashscreens/ipadpro1_splash.png"
        media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/images/splashscreens/ipadpro3_splash.png"
        media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/images/splashscreens/ipadpro2_splash.png"
        media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link rel="manifest" href="/manifest.json" />
    </>
  );

  const renderGaScriptTags = !!process.env.GA_TRACKING_ID && (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
      />
      <script dangerouslySetInnerHTML={GAScript} />
    </>
  );

  return (
    <Head>
      {renderCommonMetaTags}
      {renderAndroidMetaTags}
      {renderIosMetaTags}
      {renderOgMetaTags}
      {renderTwitterMetaTags}
      {renderLinkTags}
      {renderGaScriptTags}
    </Head>
  );
};
