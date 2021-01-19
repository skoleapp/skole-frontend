import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
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
