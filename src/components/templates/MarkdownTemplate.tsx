import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';
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
  customTopContent?: JSX.Element[];
  markdownContent: string;
  customBottomContent?: JSX.Element[];
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
  const { isTabletOrDesktop } = useMediaQueries();
  const { t } = useTranslation();
  const header = topNavbarProps?.header;
  const emoji = topNavbarProps?.emoji;

  const renderEmoji = !!emoji && <Emoji emoji={emoji} />;

  const renderHeaderTitle = (
    <>
      {header}
      {renderEmoji}
    </>
  );

  const renderCardHeader = isTabletOrDesktop && (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        title: classes.cardHeaderTitle,
      }}
      title={renderHeaderTitle}
    />
  );

  const renderCustomTopContent = customTopContent?.map((t) => t);
  const renderMarkdownContent = <MarkdownContent>{markdownContent}</MarkdownContent>;
  const renderCustomBottomContent = customBottomContent?.map((t) => t);

  const renderCardContent = (
    <CardContent className={classes.cardContent}>
      <Grid container justify="center">
        <Grid item xs={12} sm={8} md={6} lg={5} xl={4}>
          {renderCustomTopContent}
          {renderMarkdownContent}
          {renderCustomBottomContent}
        </Grid>
      </Grid>
    </CardContent>
  );

  const feedbackHeaderText = t('common:feedbackHeader');
  const renderFeedbackHeaderEmoji = <Emoji emoji="🤔" />;

  const renderFeedback = !hideFeedback && (
    <Grid className={classes.feedbackContainer} container direction="column" alignItems="center">
      <Typography variant="subtitle1" gutterBottom>
        {feedbackHeaderText}
        {renderFeedbackHeaderEmoji}
      </Typography>
      <ButtonLink href={urls.contact} variant="outlined" endIcon={<ArrowForwardOutlined />}>
        {t('common:feedbackText')}
      </ButtonLink>
    </Grid>
  );

  const layoutProps = {
    topNavbarProps,
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
