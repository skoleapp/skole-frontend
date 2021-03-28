import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQueries } from 'hooks';
import React, { useMemo } from 'react';
import { BORDER, BORDER_RADIUS } from 'styles';
import { MainTemplateProps } from 'types';

import { Emoji } from '../shared';
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
  cardHeaderAction: {
    position: 'absolute',
    top: spacing(2),
    right: spacing(2),
  },
}));

interface Props extends MainTemplateProps {
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
  const { mdUp } = useMediaQueries();
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

  const renderHeader = useMemo(
    () =>
      mdUp && (
        <CardHeader
          classes={{
            root: classes.cardHeaderRoot,
            title: classes.cardHeaderTitle,
            action: classes.cardHeaderAction,
          }}
          title={renderHeaderTitle}
          action={listTemplateProps?.renderAction}
        />
      ),
    [
      mdUp,
      classes.cardHeaderAction,
      classes.cardHeaderRoot,
      classes.cardHeaderTitle,
      listTemplateProps?.renderAction,
      renderHeaderTitle,
    ],
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
