import { useTranslation } from 'lib';
import React from 'react';
import { urls } from 'utils';

import { TextLink } from './TextLink';

export const GuidelinesLink: React.FC = () => {
  const { t } = useTranslation();

  return (
    <TextLink href={urls.guidelines} target="_blank">
      {t('common:guidelinesLink')}
    </TextLink>
  );
};
