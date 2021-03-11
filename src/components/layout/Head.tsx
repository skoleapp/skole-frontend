import { useTheme } from '@material-ui/core/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { SeoProps } from 'types';
import { urls } from 'utils';

export const HeadComponent: React.FC<SeoProps> = ({ title: _title, description }) => {
  const { palette } = useTheme();
  const { pathname } = useRouter();
  const title = _title ? `Skole | ${_title}` : 'Skole';

  // Temporary solution to nuke all other pages that the landing page.
  const renderNoIndex = pathname !== urls.index && <meta name="robots" content="NONE,NOARCHIVE" />;

  const renderCommonMetaTags = (
    <>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
      />
      {!!description && <meta name="description" content={description} />}
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
      {!!description && <meta property="og:description" content={description} />}
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

  const renderSaEventsScript = <script src="/saEvents.js" />;

  return (
    <Head>
      {renderCommonMetaTags}
      {renderAndroidMetaTags}
      {renderIosMetaTags}
      {renderOgMetaTags}
      {renderTwitterMetaTags}
      {renderLinkTags}
      {renderSaEventsScript}
      {renderNoIndex}
    </Head>
  );
};
