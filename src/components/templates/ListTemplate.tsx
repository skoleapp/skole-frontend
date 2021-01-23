import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQueries } from 'hooks';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { MainTemplateProps } from 'types';

import { BackButton, Emoji } from '../shared';
import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ breakpoints, spacing, palette }) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  cardHeaderRoot: {
    borderBottom: BORDER,
    position: 'relative',
    padding: spacing(3),
  },
  cardHeaderTitle: {
    color: palette.text.secondary,
  },
  cardHeaderAvatar: {
    position: 'absolute',
    top: spacing(2),
    left: spacing(2),
  },
  cardHeaderAction: {
    position: 'absolute',
    top: spacing(2),
    right: spacing(2),
  },
}));

interface Props extends Omit<MainTemplateProps, 'children'> {
  listTemplateProps?: {
    renderAction?: JSX.Element;
  };
}

export const ListTemplate: React.FC<Props> = ({
  topNavbarProps,
  listTemplateProps,
  children,
  ...props
}) => {
  const classes = useStyles();
  const { isTabletOrDesktop } = useMediaQueries();
  const header = topNavbarProps?.header;
  const emoji = topNavbarProps?.emoji;

  const renderBackButton = <BackButton />;
  const renderEmoji = !!emoji && <Emoji emoji={emoji} />;

  const renderHeaderTitle = (
    <>
      {header}
      {renderEmoji}
    </>
  );

  const renderHeader = isTabletOrDesktop && (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        avatar: classes.cardHeaderAvatar,
        title: classes.cardHeaderTitle,
        action: classes.cardHeaderAction,
      }}
      title={renderHeaderTitle}
      avatar={renderBackButton}
      action={listTemplateProps?.renderAction}
    />
  );

  const layoutProps = {
    topNavbarProps,
    ...props,
  };

  return (
    <MainTemplate {...layoutProps}>
      <Paper className={classes.root}>
        {renderHeader}
        {children}
      </Paper>
    </MainTemplate>
  );
};
