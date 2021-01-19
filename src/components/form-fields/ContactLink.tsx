import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useTranslation } from 'lib';
import React from 'react';
import { MainTemplateProps } from 'types';
import { urls } from 'utils';

import { TextLink } from '../shared';

export const ContactLink: React.FC<Pick<MainTemplateProps, 'pageRef'>> = ({ pageRef }) => {
  const { t } = useTranslation();

  const pageRefQuery = {
    ref: pageRef,
  };

  return (
    <FormControl>
      <FormHelperText>
        {t('forms:contactLinkText')}{' '}
        <TextLink href={{ pathname: urls.contact, query: pageRefQuery || {} }}>
          {t('forms:contactLinkLink')}
        </TextLink>
      </FormHelperText>
    </FormControl>
  );
};
