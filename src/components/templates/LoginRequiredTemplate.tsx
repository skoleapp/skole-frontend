import { Button, FormControl, Typography, FormHelperText } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import Router, { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { FormTemplateProps } from 'types';
import { urls } from 'utils';
import { ButtonLink } from '../shared';
import { FormTemplate } from './FormTemplate';

interface Props extends Omit<FormTemplateProps, 'header' | 'children'> {
  text?: JSX.Element | string;
  textSecondary?: JSX.Element | string;
  children?: NonNullable<ReactNode>;
}

export const LoginRequiredTemplate: React.FC<Props> = ({
  text,
  textSecondary,
  children,
  ...props
}) => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const handleClickCancelButton = (): void => Router.back();

  const renderText = (
    <Typography variant="subtitle1" align="center">
      {text || t('common:loginRequiredText')} 🙃
    </Typography>
  );

  const renderLineBreak = <Typography component="br" />;

  const renderLoginButton = (
    <ButtonLink
      href={{ pathname: urls.login, query: { next: asPath } }}
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

  const renderSecondaryText = !!textSecondary && (
    <FormControl>
      <FormHelperText>{textSecondary}</FormHelperText>
    </FormControl>
  );

  return (
    <FormTemplate {...props} header={t('common:loginRequiredHeader')}>
      {renderText}
      {renderLineBreak}
      {renderLoginButton}
      {renderCancelButton}
      {renderSecondaryText}
      {children}
    </FormTemplate>
  );
};
