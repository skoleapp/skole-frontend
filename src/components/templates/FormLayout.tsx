import { CardContent, CardHeader, Grid, makeStyles, Paper } from '@material-ui/core';
import clsx from 'clsx';
import { useMediaQueries } from 'hooks';
import React from 'react';
import { MainLayoutProps, TopNavbarProps } from 'types';

import { MainLayout } from './MainLayout';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

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
                <Grid item xs={12} sm={8} md={5} lg={4} xl={3}>
                    {children}
                </Grid>
            </Grid>
        </CardContent>
    );

    return (
        <MainLayout {...layoutProps}>
            <Paper className={clsx('paper-container', classes.root)}>
                {renderCardHeader}
                {renderCardContent}
            </Paper>
        </MainLayout>
    );
};
