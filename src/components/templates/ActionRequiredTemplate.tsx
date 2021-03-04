import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { useTranslation } from 'lib';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { MainTemplateProps } from 'types';
import { urls } from 'utils';

import { ButtonLink, Emoji } from '../shared';
import { FormTemplate } from './FormTemplate';

type ActionRequiredVariant = 'login' | 'verify-account' | 'logout';

interface Props extends MainTemplateProps {
  variant: ActionRequiredVariant;
}

const getProps = (variant: ActionRequiredVariant): Record<string, unknown> | void => {
  switch (variant) {
    case 'login': {
      return {
        text: 'common:loginRequired',
        buttonText: 'common:login',
        pathname: urls.login,
      };
    }

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
      break;
    }
  }
};

export const ActionRequiredTemplate: React.FC<Props> = ({ children, variant, ...props }) => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const handleClickCancelButton = (): void => Router.back();

  const { text, buttonText, pathname } = R.pick(
    ['text', 'buttonText', 'pathname'],
    getProps(variant),
  );

  const buttonHref = {
    pathname,
    query: {
      next: asPath,
    },
  };

  const renderEmoji = <Emoji emoji="🙃" />;

  const renderText = (
    <FormControl>
      <Typography variant="subtitle1" align="center">
        {t(text)}
        {renderEmoji}
      </Typography>
    </FormControl>
  );

  const renderButton = (
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
  );

  const renderCancelButton = (
    <FormControl>
      <Button onClick={handleClickCancelButton} variant="outlined" fullWidth>
        {t('common:cancel')}
      </Button>
    </FormControl>
  );

  return (
    <FormTemplate {...props}>
      {renderText}
      {renderButton}
      {renderCancelButton}
      {children}
    </FormTemplate>
  );
};
