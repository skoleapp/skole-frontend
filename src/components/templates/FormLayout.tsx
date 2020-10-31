import { CardContent, CardHeader, Grid, makeStyles, Paper } from '@material-ui/core';
import { useMediaQueries } from 'hooks';
import React from 'react';
import { BORDER_RADIUS } from 'theme';
import { MainLayoutProps, TopNavbarProps } from 'types';

import { MainLayout } from './MainLayout';

const useStyles = makeStyles(({ breakpoints }) => ({
    root: {
        flexGrow: 1,
        [breakpoints.up('lg')]: {
            borderRadius: BORDER_RADIUS,
        },
    },
}));

interface Props extends Omit<MainLayoutProps, 'topNavbarProps'> {
    topNavbarProps: Omit<TopNavbarProps, 'header'>;
    header: string;
}

export const FormLayout: React.FC<Props> = ({ children, header, ...props }) => {
    const classes = useStyles();
    const { isDesktop } = useMediaQueries();

    const layoutProps = {
        ...props,
        topNavbarProps: {
            ...props.topNavbarProps,
            header,
        },
    };

    const renderCardHeader = isDesktop && <CardHeader title={header} />;

    const renderCardContent = (
        <CardContent>
            <Grid container justify="center">
                <Grid item xs={12} sm={8} md={4} lg={3} xl={2}>
                    {children}
                </Grid>
            </Grid>
        </CardContent>
    );

    return (
        <MainLayout {...layoutProps}>
            <Paper className={classes.root}>
                {renderCardHeader}
                {renderCardContent}
            </Paper>
        </MainLayout>
    );
};
