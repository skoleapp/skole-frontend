import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { useTranslation } from 'lib';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { MainTemplateProps } from 'types';
import { urls } from 'utils';

import { ButtonLink, Emoji } from '../shared';
import { FormTemplate } from './FormTemplate';

export const LogoutRequiredTemplate: React.FC<MainTemplateProps> = ({ children, ...props }) => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const text = t('common:logoutRequired');
  const handleClickCancelButton = (): void => Router.back();

  const logoutButtonHref = {
    pathname: urls.logout,
    query: {
      next: asPath,
    },
  };

  const renderEmoji = <Emoji emoji="🙃" />;

  const renderText = (
    <FormControl>
      <Typography variant="subtitle1" align="center">
        {text}
        {renderEmoji}
      </Typography>
    </FormControl>
  );

  const renderLogoutButton = (
    <FormControl>
      <ButtonLink
        href={logoutButtonHref}
        color="primary"
        variant="contained"
        endIcon={<ArrowForwardOutlined />}
        fullWidth
      >
        {t('common:logout')}
      </ButtonLink>
    </FormControl>
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
      {renderLogoutButton}
      {renderCancelButton}
      {children}
    </FormTemplate>
  );
};
