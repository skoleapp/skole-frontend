import { FormControl, FormHelperText } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';
import { urls } from 'utils';
import { TextLink } from '../shared';

export const ContactLink: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FormControl>
      <FormHelperText>
        {t('forms:contactLinkText')}{' '}
        <TextLink href={urls.contact}>{t('forms:contactLinkLink')}</TextLink>
      </FormHelperText>
    </FormControl>
  );
};
