import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQueries } from 'hooks';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { MainTemplateProps } from 'types';

import { Emoji, MarkdownContent } from '../shared';
import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ breakpoints, palette }) => ({
  root: {
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

interface Props extends MainTemplateProps {
  content: string;
}

export const MarkdownTemplate: React.FC<Props> = ({
  content,
  topNavbarProps,
  children,
  ...props
}) => {
  const classes = useStyles();
  const { isTabletOrDesktop } = useMediaQueries();
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

  const renderMarkdownContent = <MarkdownContent>{content}</MarkdownContent>;

  const renderCardContent = (
    <CardContent>
      <Grid container justify="center">
        <Grid item xs={12} sm={8} md={6} lg={5} xl={4}>
          {children}
          {renderMarkdownContent}
        </Grid>
      </Grid>
    </CardContent>
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
      </Paper>
    </MainTemplate>
  );
};
