import { FormControl, FormHelperText } from '@material-ui/core';
import { useTranslation } from 'next-translate';
import React from 'react';
import { urls } from 'utils';
import { TextLink } from '../shared';

export const ContactLink: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FormControl>
      <FormHelperText>
        {t('forms:schoolSubjectNotFoundText')}{' '}
        <TextLink href={urls.contact}>{t('forms:schoolSubjectNotFoundLink')}</TextLink>
      </FormHelperText>
    </FormControl>
  );
};