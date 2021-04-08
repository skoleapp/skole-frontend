import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { useAuthContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React, { useMemo } from 'react';
import { BORDER, BORDER_RADIUS } from 'styles';
import { MainTemplateProps } from 'types';
import { urls } from 'utils';

import { ButtonLink, Emoji, MarkdownContent } from '../shared';
import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ breakpoints, palette, spacing }) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  cardHeaderRoot: {
    borderBottom: BORDER,
  },
  cardHeaderTitle: {
    color: palette.text.secondary,
  },
  cardContent: {
    flexGrow: 1,
  },
  feedbackContainer: {
    padding: spacing(4),
  },
}));

interface Props extends MainTemplateProps {
  customTopContent?: (JSX.Element | false)[];
  markdownContent: string;
  customBottomContent?: (JSX.Element | false)[];
  hideFeedback?: boolean;
}

export const MarkdownTemplate: React.FC<Props> = ({
  customTopContent,
  markdownContent,
  customBottomContent,
  topNavbarProps,
  children,
  hideFeedback,
  ...props
}) => {
  const classes = useStyles();
  const { smUp } = useMediaQueries();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const header = topNavbarProps?.header;
  const emoji = topNavbarProps?.emoji;

  const renderEmoji = useMemo(() => !!emoji && <Emoji emoji={emoji} />, [emoji]);

  const renderHeaderTitle = useMemo(
    () => (
      <>
        {header}
        {renderEmoji}
      </>
    ),
    [header, renderEmoji],
  );

  const renderCardHeader = useMemo(
    () =>
      smUp && (
        <CardHeader
          classes={{
            root: classes.cardHeaderRoot,
            title: classes.cardHeaderTitle,
          }}
          title={renderHeaderTitle}
        />
      ),
    [classes.cardHeaderRoot, classes.cardHeaderTitle, renderHeaderTitle, smUp],
  );

  const renderCustomTopContent = useMemo(() => customTopContent?.map((t) => t), [customTopContent]);

  const renderMarkdownContent = useMemo(
    () => <MarkdownContent>{markdownContent}</MarkdownContent>,
    [markdownContent],
  );

  const renderCustomBottomContent = useMemo(() => customBottomContent?.map((t) => t), [
    customBottomContent,
  ]);

  const renderCardContent = useMemo(
    () => (
      <CardContent className={classes.cardContent}>
        <Grid container justify="center">
          <Grid item xs={12} sm={10} md={8}>
            {renderCustomTopContent}
            {renderMarkdownContent}
            {renderCustomBottomContent}
          </Grid>
        </Grid>
      </CardContent>
    ),
    [classes.cardContent, renderCustomBottomContent, renderCustomTopContent, renderMarkdownContent],
  );

  const feedbackHeaderText = t('common:feedbackHeader');
  const renderFeedbackHeaderEmoji = useMemo(() => <Emoji emoji="🤔" />, []);

  const renderFeedback = useMemo(
    () =>
      !hideFeedback && (
        <Grid
          className={classes.feedbackContainer}
          container
          direction="column"
          alignItems="center"
        >
          <Typography variant="subtitle1" gutterBottom>
            {feedbackHeaderText}
            {renderFeedbackHeaderEmoji}
          </Typography>
          <ButtonLink href={urls.contact} variant="outlined" endIcon={<ArrowForwardOutlined />}>
            {t('common:feedbackText')}
          </ButtonLink>
        </Grid>
      ),
    [classes.feedbackContainer, feedbackHeaderText, hideFeedback, renderFeedbackHeaderEmoji, t],
  );

  const layoutProps = {
    topNavbarProps,
    hideBottomNavbar: !userMe,
    ...props,
  };

  return (
    <MainTemplate {...layoutProps}>
      <Paper className={classes.root}>
        {renderCardHeader}
        {renderCardContent}
        {renderFeedback}
      </Paper>
    </MainTemplate>
  );
};
