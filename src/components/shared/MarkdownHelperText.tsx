import { useTranslation } from 'lib';
import React from 'react';

import { TextLink } from './TextLink';

export const MarkdownHelperText: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      {t('forms:markdownHelperText')}{' '}
      <TextLink href="https://commonmark.org/help/" target="_blank">
        {t('forms:markdownHelperTextLink')}
      </TextLink>
      .
    </>
  );
};
