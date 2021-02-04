import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import { useMediaQueries } from 'hooks';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

import { TextLink } from '../shared';

export const CommentTextFieldHelperText: React.FC = () => {
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();

  const renderMarkdownLink = (
    <TextLink href="https://commonmark.org/help/" target="_blank">
      {t('discussion:markdown')}
    </TextLink>
  );

  const renderMarkdownHelperText = (
    <FormHelperText>
      {t('discussion:helperTextMarkdown')} {renderMarkdownLink}.
    </FormHelperText>
  );

  const renderCombinationHelperText = isTabletOrDesktop && (
    <FormHelperText>
      {t('discussion:helperTextCombination', { combination: 'Shift + Enter' })}
    </FormHelperText>
  );

  return (
    <Grid container direction="column">
      {renderMarkdownHelperText}
      {renderCombinationHelperText}
    </Grid>
  );
};
