import { Button, FormControl, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { FormTemplateProps } from 'types';
import { urls } from 'utils';
import { ButtonLink } from '../shared';
import { FormTemplate } from './FormTemplate';

export const LogoutRequiredTemplate: React.FC<Omit<FormTemplateProps, 'header' | 'children'>> = ({
  ...props
}) => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const handleClickCancelButton = (): void => Router.back();

  const renderText = (
    <Typography variant="subtitle1" align="center">
      {t('common:logoutRequiredText')} 🙃
    </Typography>
  );

  const renderLineBreak = <Typography component="br" />;

  const renderLogoutButton = (
    <ButtonLink
      href={{ pathname: urls.logout, query: { next: asPath } }}
      color="primary"
      variant="contained"
      endIcon={<ArrowForwardOutlined />}
      fullWidth
    >
      {t('common:logout')}
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
    <FormTemplate {...props} header={t('common:logoutRequiredHeader')}>
      {renderText}
      {renderLineBreak}
      {renderLogoutButton}
      {renderCancelButton}
    </FormTemplate>
  );
};