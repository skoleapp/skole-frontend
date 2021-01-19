import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { useTranslation } from 'lib';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { MainTemplateProps } from 'types';
import { urls } from 'utils';

import { ButtonLink } from '../shared';
import { FormTemplate } from './FormTemplate';

export const LoginRequiredTemplate: React.FC<MainTemplateProps> = ({ children, ...props }) => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const handleClickCancelButton = (): void => Router.back();

  const loginButtonHref = {
    pathname: urls.login,
    query: {
      next: asPath,
    },
  };

  const renderText = (
    <Typography variant="subtitle1" align="center">
      {t('common:loginRequired')} 🙃
    </Typography>
  );

  const renderLineBreak = <Typography component="br" />;

  const renderLoginButton = (
    <ButtonLink
      href={loginButtonHref}
      color="primary"
      variant="contained"
      endIcon={<ArrowForwardOutlined />}
      fullWidth
    >
      {t('common:login')}
    </ButtonLink>
  );

  const renderCancelButton = (
    <FormControl>
      <Button onClick={handleClickCancelButton} color="primary" variant="outlined" fullWidth>
        {t('common:cancel')}
      </Button>
    </FormControl>
  );

  return (
    <FormTemplate {...props}>
      {renderText}
      {renderLineBreak}
      {renderLoginButton}
      {renderCancelButton}
      {children}
    </FormTemplate>
  );
};
