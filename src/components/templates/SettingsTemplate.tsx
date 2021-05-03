import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQueryContext } from 'context';
import { useTranslation } from 'lib';
import React, { useMemo } from 'react';
import { BORDER, BORDER_RADIUS } from 'styles';
import { MainTemplateProps } from 'types';

import { Emoji, SettingsButton, SettingsList } from '../shared';
import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ breakpoints, palette }) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    display: 'flex',
  },
  paper: {
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    flexGrow: 1,
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
}));

export const SettingsTemplate: React.FC<MainTemplateProps> = ({
  children,
  topNavbarProps,
  ...props
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { mdUp } = useMediaQueryContext();
  const settingsHeaderText = t('common:settings');
  const mainHeaderText = topNavbarProps?.header;

  const renderSettingsEmoji = useMemo(() => <Emoji emoji="⚙️" />, []);

  const renderMainEmojiEmoji = useMemo(
    () => topNavbarProps?.emoji && <Emoji emoji={topNavbarProps.emoji} />,
    [topNavbarProps?.emoji],
  );

  const renderHeaderRight = useMemo(() => <SettingsButton />, []);

  const settingsHeaderTitle = useMemo(
    () => (
      <>
        {settingsHeaderText}
        {renderSettingsEmoji}
      </>
    ),
    [renderSettingsEmoji, settingsHeaderText],
  );

  const renderSettingsHeader = useMemo(
    () => (
      <CardHeader
        classes={{
          root: classes.cardHeaderRoot,
          title: classes.cardHeaderTitle,
        }}
        title={settingsHeaderTitle}
      />
    ),
    [classes.cardHeaderRoot, classes.cardHeaderTitle, settingsHeaderTitle],
  );

  const renderSettingsList = useMemo(() => <SettingsList />, []);

  const renderSettingsCard = useMemo(
    () =>
      mdUp && (
        <Grid item xs={12} md={4} className={classes.container}>
          <Paper className={classes.paper}>
            {renderSettingsHeader}
            {renderSettingsList}
          </Paper>
        </Grid>
      ),
    [classes.container, classes.paper, renderSettingsHeader, renderSettingsList, mdUp],
  );

  const renderMainHeaderTitle = useMemo(
    () => (
      <>
        {mainHeaderText}
        {renderMainEmojiEmoji}
      </>
    ),
    [mainHeaderText, renderMainEmojiEmoji],
  );

  const renderHeader = useMemo(
    () =>
      mdUp && (
        <CardHeader
          classes={{ root: classes.cardHeaderRoot, title: classes.cardHeaderTitle }}
          title={renderMainHeaderTitle}
        />
      ),
    [classes.cardHeaderRoot, classes.cardHeaderTitle, renderMainHeaderTitle, mdUp],
  );

  const renderContent = useMemo(
    () => (
      <CardContent className={classes.container}>
        <Grid container justify="center" className={classes.container}>
          <Grid
            item
            container
            direction="column"
            xs={12}
            sm={10}
            lg={8}
            className={classes.container}
          >
            {children}
          </Grid>
        </Grid>
      </CardContent>
    ),
    [children, classes.container],
  );

  const renderContentCard = useMemo(
    () => (
      <Grid item xs={12} md={8} container className={classes.container}>
        <Paper className={classes.paper}>
          {renderHeader}
          {renderContent}
        </Paper>
      </Grid>
    ),
    [classes.container, classes.paper, renderContent, renderHeader],
  );

  const layoutProps = {
    ...props,
    topNavbarProps: {
      ...topNavbarProps,
      renderHeaderRight,
    },
  };

  return (
    <MainTemplate {...layoutProps}>
      <Grid container spacing={mdUp ? 2 : 0} className={classes.root}>
        {renderSettingsCard}
        {renderContentCard}
      </Grid>
    </MainTemplate>
  );
};
