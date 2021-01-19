import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { useMediaQueries, useTabs } from 'hooks';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { MainTemplateProps } from 'types';

import { BackButton, TabPanel } from '../shared';
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
  cardHeaderAction: {
    position: 'absolute',
    top: spacing(2),
    right: spacing(2),
  },
}));

interface Props extends Omit<MainTemplateProps, 'children'> {
  tabTemplateProps: {
    leftTabLabel: string;
    rightTabLabel: string;
    renderLeftTabContent: JSX.Element;
    renderRightTabContent: JSX.Element;
    renderAction?: JSX.Element;
  };
}

export const TabTemplate: React.FC<Props> = ({
  topNavbarProps,
  tabTemplateProps: {
    leftTabLabel,
    rightTabLabel,
    renderLeftTabContent,
    renderRightTabContent,
    renderAction,
  },
  children,
  ...props
}) => {
  const classes = useStyles();
  const { isTabletOrDesktop } = useMediaQueries();
  const { tabsProps, leftTabPanelProps, rightTabPanelProps } = useTabs();

  const renderBackButton = <BackButton />;

  const renderHeader = isTabletOrDesktop && (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        avatar: classes.cardHeaderAvatar,
        action: classes.cardHeaderAction,
      }}
      title={topNavbarProps?.header}
      avatar={renderBackButton}
      action={renderAction}
    />
  );

  const renderTabs = (
    <>
      <Tabs {...tabsProps}>
        <Tab label={leftTabLabel} />
        <Tab label={rightTabLabel} />
      </Tabs>
      <TabPanel {...leftTabPanelProps}>{renderLeftTabContent}</TabPanel>
      <TabPanel {...rightTabPanelProps}>{renderRightTabContent}</TabPanel>
    </>
  );

  const renderContent = (
    <Paper className={classes.root}>
      {renderHeader}
      {renderTabs}
    </Paper>
  );

  const layoutProps = {
    topNavbarProps,
    ...props,
  };

  return (
    <MainTemplate {...layoutProps}>
      {renderContent}
      {children}
    </MainTemplate>
  );
};
