import { CardHeader, IconButton, makeStyles, Paper, Tab, Tabs, Tooltip } from '@material-ui/core';
import { ArrowBackOutlined } from '@material-ui/icons';
import { useMediaQueries, useTabs } from 'hooks';
import { useTranslation } from 'next-translate';
import { useRouter } from 'next/router';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { MainTemplateProps } from 'types';
import { TabPanel } from '../shared';
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
  cardHeader: {
    borderBottom: BORDER,
    paddingLeft: spacing(2),
  },
}));

interface Props extends Omit<MainTemplateProps, 'children'> {
  cardHeader: string;
  leftTabLabel: string;
  rightTabLabel: string;
  renderLeftTabContent: JSX.Element;
  renderRightTabContent: JSX.Element;
  renderAction?: JSX.Element;
  children?: JSX.Element[];
}

export const TabTemplate: React.FC<Props> = ({
  cardHeader,
  leftTabLabel,
  rightTabLabel,
  renderLeftTabContent,
  renderRightTabContent,
  renderAction,
  topNavbarProps,
  children,
  ...props
}) => {
  const classes = useStyles();
  const router = useRouter();
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();
  const { tabsProps, leftTabPanelProps, rightTabPanelProps } = useTabs();
  const staticBackUrl = topNavbarProps?.staticBackUrl;
  const handleBackButtonClick = () => (staticBackUrl ? router.push(staticBackUrl) : router.back());

  const renderBackButton = (
    <Tooltip title={t('tooltips:goBack')}>
      <IconButton onClick={handleBackButtonClick} size="small">
        <ArrowBackOutlined />
      </IconButton>
    </Tooltip>
  );

  const renderHeader = isTabletOrDesktop && (
    <CardHeader
      className={classes.cardHeader}
      title={cardHeader}
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

  return (
    <MainTemplate {...props}>
      {renderContent}
      {children}
    </MainTemplate>
  );
};
