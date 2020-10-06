import { CardContent, CardHeader, Grid, makeStyles, Paper } from '@material-ui/core';
import clsx from 'clsx';
import { useMediaQueries, useSettings } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';
import { BORDER_RADIUS } from 'theme';
import { MainLayoutProps, TopNavbarProps } from 'types';

import { SettingsButton } from '..';
import { MainLayout } from './MainLayout';

const useStyles = makeStyles(({ breakpoints }) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        width: '100%',
        [breakpoints.down('lg')]: {
            margin: 0,
        },
    },
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        [breakpoints.up('lg')]: {
            borderRadius: BORDER_RADIUS,
        },
    },
    disablePadding: {
        padding: '0 !important',
    },
}));

interface Props extends Omit<MainLayoutProps, 'topNavbarProps'> {
    topNavbarProps: Omit<TopNavbarProps, 'header' | 'headerRight'>;
    header: string;
    headerRight?: JSX.Element;
    dense?: boolean; // Show tighter content on the right-hand paper, e.g. forms.
    disablePadding?: boolean; // Disable padding on the right-hand paper's card content.
}

export const SettingsLayout: React.FC<Props> = ({
    topNavbarProps,
    header,
    headerRight,
    dense,
    disablePadding,
    children,
    ...props
}) => {
    const classes = useStyles();
    const { renderSettingsMenuList } = useSettings(false);
    const { t } = useTranslation();
    const { isMobileOrTablet } = useMediaQueries();

    const denseColSpan = {
        xs: 12,
        sm: 8,
        md: 6,
        lg: 4,
    };

    const colSpan = dense ? denseColSpan : {};

    const renderSettingsButton = isMobileOrTablet ? <SettingsButton color="secondary" /> : undefined;
    const renderHeaderRight = headerRight || renderSettingsButton;

    const customTopNavbarProps = {
        ...topNavbarProps,
        header,
        headerRight: renderHeaderRight,
    };

    const renderSettingsHeader = <CardHeader title={t('common:settings')} />;

    const renderSettingsCard = !isMobileOrTablet && (
        <Grid item xs={12} lg={3} className={classes.container}>
            <Paper className={classes.container}>
                {renderSettingsHeader}
                {renderSettingsMenuList}
            </Paper>
        </Grid>
    );

    const renderHeader = !isMobileOrTablet && <CardHeader title={header} action={renderHeaderRight} />;

    const renderContent = (
        <CardContent className={clsx(classes.container, disablePadding && classes.disablePadding)}>
            <Grid container alignItems="center" className={classes.container}>
                <Grid item container direction="column" xs={12} {...colSpan}>
                    {children}
                </Grid>
            </Grid>
        </CardContent>
    );

    const renderContentCard = (
        <Grid
            item
            xs={12}
            lg={9}
            container
            className={clsx(classes.container, isMobileOrTablet && classes.disablePadding)}
        >
            <Paper className={classes.container}>
                {renderHeader}
                {renderContent}
            </Paper>
        </Grid>
    );

    return (
        <MainLayout {...props} topNavbarProps={customTopNavbarProps}>
            <Grid container spacing={2} className={classes.root}>
                {renderSettingsCard}
                {renderContentCard}
            </Grid>
        </MainLayout>
    );
};
