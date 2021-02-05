import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'styles';
import { MainTemplateProps } from 'types';

import { SettingsButton, SettingsList } from '../settings';
import { Emoji } from '../shared';
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
  const { isTabletOrDesktop } = useMediaQueries();
  const settingsHeaderText = t('common:settings');
  const mainHeaderText = topNavbarProps?.header;

  const renderSettingsEmoji = <Emoji emoji="⚙️" />;
  const renderMainEmojiEmoji = topNavbarProps?.emoji && <Emoji emoji={topNavbarProps.emoji} />;
  const renderHeaderRight = <SettingsButton />;

  const settingsHeaderTitle = (
    <>
      {settingsHeaderText}
      {renderSettingsEmoji}
    </>
  );

  const renderSettingsHeader = (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        title: classes.cardHeaderTitle,
      }}
      title={settingsHeaderTitle}
    />
  );

  const renderSettingsList = <SettingsList />;

  const renderSettingsCard = isTabletOrDesktop && (
    <Grid item xs={12} md={4} lg={3} className={classes.container}>
      <Paper className={classes.paper}>
        {renderSettingsHeader}
        {renderSettingsList}
      </Paper>
    </Grid>
  );

  const renderMainHeaderTitle = (
    <>
      {mainHeaderText}
      {renderMainEmojiEmoji}
    </>
  );

  const renderHeader = isTabletOrDesktop && (
    <CardHeader
      classes={{ root: classes.cardHeaderRoot, title: classes.cardHeaderTitle }}
      title={renderMainHeaderTitle}
    />
  );

  const renderContent = (
    <CardContent className={classes.container}>
      <Grid container justify="center" className={classes.container}>
        <Grid
          item
          container
          direction="column"
          xs={12}
          sm={8}
          lg={5}
          xl={4}
          className={classes.container}
        >
          {children}
        </Grid>
      </Grid>
    </CardContent>
  );

  const renderContentCard = (
    <Grid item xs={12} md={8} lg={9} container className={classes.container}>
      <Paper className={classes.paper}>
        {renderHeader}
        {renderContent}
      </Paper>
    </Grid>
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
      <Grid container spacing={isTabletOrDesktop ? 2 : 0} className={classes.root}>
        {renderSettingsCard}
        {renderContentCard}
      </Grid>
    </MainTemplate>
  );
};
