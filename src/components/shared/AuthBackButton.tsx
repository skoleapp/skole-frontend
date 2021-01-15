import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React from 'react';
import { urls } from 'utils';
import { BackButton } from './BackButton';

// A custom back button used in login/register pages.
// If the user navigates to those pages from the get started page, then we use navigate back there from the back button and also use a custom tooltip.
export const AuthBackButton: React.FC = () => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const getStartedRef = query.ref === 'get-started';
  const backButtonHref = getStartedRef ? urls.index : urls.home;
  const backButtonTooltip = getStartedRef && t('common-tooltips:backToGetStarted');
  return <BackButton href={backButtonHref} tooltip={backButtonTooltip} />;
};
