import { CardHeader, makeStyles, Paper } from '@material-ui/core';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import Router from 'next/router';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';

import { BackButton, NotFoundBox } from '../shared';
import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  cardHeaderRoot: {
    borderBottom: BORDER,
    position: 'relative',
    padding: spacing(3),
  },
  cardHeaderAvatar: {
    position: 'absolute',
    top: spacing(2),
    left: spacing(2),
  },
}));

interface Props {
  variant: 'error' | 'offline' | 'not-found';
}

export const ErrorTemplate: React.FC<Props> = ({ variant }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();

  const title = t(`${variant}:title`);
  const header = t(`${variant}:header`);
  const text = t(`${variant}:text`);

  const renderBackButton = <BackButton onClick={() => Router.back()} />;

  const renderCardHeader = isTabletOrDesktop && (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        avatar: classes.cardHeaderAvatar,
      }}
      title={header}
      avatar={renderBackButton}
    />
  );

  const renderContent = <NotFoundBox text={text} />;

  const layoutProps = {
    seoProps: {
      title,
    },
    topNavbarProps: {
      header,
      dynamicBackUrl: true,
      hideSearch: true,
      hideAuthButtons: true,
      hideForTeachersButton: true,
      hideLanguageButton: true,
    },
  };

  return (
    <MainTemplate {...layoutProps}>
      <Paper className={classes.root}>
        {renderCardHeader}
        {renderContent}
      </Paper>
    </MainTemplate>
  );
};
