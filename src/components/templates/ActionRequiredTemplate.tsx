import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { useTranslation } from 'lib';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useMemo } from 'react';
import { MainTemplateProps } from 'types';
import { urls } from 'utils';

import { ButtonLink, Emoji } from '../shared';
import { FormTemplate } from './FormTemplate';

type ActionRequiredVariant = 'verify-account' | 'logout';

interface Props extends MainTemplateProps {
  variant: ActionRequiredVariant;
}

interface DynamicProps {
  text: string;
  buttonText: string;
  pathname: string;
}

const getProps = (variant: ActionRequiredVariant): DynamicProps => {
  switch (variant) {
    case 'verify-account': {
      return {
        text: 'common:verificationRequired',
        buttonText: 'common:verifyAccount',
        pathname: urls.verifyAccount,
      };
    }

    case 'logout': {
      return {
        text: 'common:logoutRequired',
        buttonText: 'common:logout',
        pathname: urls.logout,
      };
    }

    default: {
      return {
        text: '',
        buttonText: '',
        pathname: '',
      };
    }
  }
};

export const ActionRequiredTemplate: React.FC<Props> = ({
  children,
  variant,
  topNavbarProps,
  ...props
}) => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const header = t('common:actionRequiredHeader');

  const { text, buttonText, pathname } = R.pick<DynamicProps, string>(
    ['text', 'buttonText', 'pathname'],
    getProps(variant),
  );

  const buttonHref = useMemo(
    () => ({
      pathname,
      query: {
        next: asPath,
      },
    }),
    [asPath, pathname],
  );

  const renderEmoji = useMemo(() => <Emoji emoji="🙃" />, []);

  const renderHeader = useMemo(
    () => (
      <>
        {header}
        {renderEmoji}
      </>
    ),
    [header, renderEmoji],
  );

  const renderText = useMemo(
    () => (
      <FormControl>
        <Typography variant="subtitle1" align="center">
          {t(text)}
        </Typography>
      </FormControl>
    ),
    [t, text],
  );

  const renderButton = useMemo(
    () => (
      <FormControl>
        <ButtonLink
          href={buttonHref}
          color="primary"
          variant="contained"
          endIcon={<ArrowForwardOutlined />}
          fullWidth
        >
          {t(buttonText)}
        </ButtonLink>
      </FormControl>
    ),
    [buttonText, t, buttonHref],
  );

  const layoutProps = {
    topNavbarProps: {
      ...R.omit(['emoji'], topNavbarProps),
      header: renderHeader,
    },
    ...props,
  };

  return (
    <FormTemplate {...layoutProps}>
      {renderText}
      {renderButton}
      {children}
    </FormTemplate>
  );
};
