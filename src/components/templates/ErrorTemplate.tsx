import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'styles';
import { SeoProps } from 'types';

import { Emoji, NotFoundBox } from '../shared';
import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ breakpoints }) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  cardHeader: {
    borderBottom: BORDER,
  },
}));

interface Props {
  variant: 'error' | 'offline' | 'not-found';
  seoProps: SeoProps;
}

export const ErrorTemplate: React.FC<Props> = ({ variant, seoProps }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();
  const title = t(`${variant}:title`);
  const header = t(`${variant}:header`);
  const text = t(`${variant}:text`);
  const emoji = '⚠️';

  const renderEmoji = <Emoji emoji={emoji} />;

  const renderTitle = (
    <>
      {header}
      {renderEmoji}
    </>
  );

  const renderCardHeader = isTabletOrDesktop && (
    <CardHeader className={classes.cardHeader} title={renderTitle} />
  );

  const renderContent = <NotFoundBox text={text} />;

  const layoutProps = {
    seoProps: {
      ...seoProps,
      title,
    },
    topNavbarProps: {
      header,
      emoji,
      hideSearch: true,
      hideDynamicButtons: true,
      hideLanguageButton: true,
      hideDarkModeButton: true,
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
