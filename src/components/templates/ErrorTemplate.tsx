import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React, { useMemo } from 'react';
import { BORDER, BORDER_RADIUS } from 'styles';

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
}

export const ErrorTemplate: React.FC<Props> = ({ variant }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { smUp } = useMediaQueries();
  const title = t(`${variant}:title`);
  const header = t(`${variant}:header`);
  const text = t(`${variant}:text`);
  const emoji = '⚠️';

  const renderEmoji = useMemo(() => <Emoji emoji={emoji} />, []);

  const renderTitle = useMemo(
    () => (
      <>
        {header}
        {renderEmoji}
      </>
    ),
    [header, renderEmoji],
  );

  const renderCardHeader = useMemo(
    () => smUp && <CardHeader className={classes.cardHeader} title={renderTitle} />,
    [classes.cardHeader, renderTitle, smUp],
  );

  const renderContent = useMemo(() => <NotFoundBox text={text} />, [text]);

  const layoutProps = {
    seoProps: {
      title,
    },
    topNavbarProps: {
      header,
      emoji,
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
