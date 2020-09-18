import { Container, Grid, makeStyles } from '@material-ui/core';
import { useAuthContext } from 'context';
import { useMediaQueries } from 'hooks';
import * as R from 'ramda';
import React, { StyleHTMLAttributes } from 'react';
import { BOTTOM_NAVBAR_HEIGHT } from 'theme';
import { MainLayoutProps } from 'types';

import {
    AttachmentViewer,
    BottomNavbar,
    CommentThreadModal,
    Footer,
    Head,
    LanguageSelectorModal,
    Notifications,
    SettingsModal,
    TopNavbar,
} from '..';

const useStyles = makeStyles(({ palette, breakpoints, spacing }) => ({
    root: {
        minHeight: '100vh',
        backgroundColor: palette.secondary.main,
    },
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        padding: 0,
        [breakpoints.up('lg')]: {
            padding: spacing(4),
        },
        [breakpoints.down('md')]: {
            // marginBottom: BOTTOM_NAVBAR_HEIGHT,
        },
    },
}));

export const MainLayout: React.FC<MainLayoutProps> = ({
    seoProps,
    topNavbarProps,
    containerProps,
    customTopNavbar,
    customBottomNavbar,
    disableBottomNavbar,
    disableFooter,
    children,
    ...props
}) => {
    const classes = useStyles();
    const { isMobileOrTablet } = useMediaQueries();
    const { userMe } = useAuthContext();
    const renderHead = <Head {...seoProps} />;
    const renderTopNavbar = (isMobileOrTablet && customTopNavbar) || <TopNavbar {...topNavbarProps} />;
    const containerPropsStyle: StyleHTMLAttributes<HTMLStyleElement> = R.propOr({}, 'style', containerProps);

    const containerStyle = {
        ...containerPropsStyle,
        marginBottom: disableBottomNavbar || !isMobileOrTablet ? 0 : BOTTOM_NAVBAR_HEIGHT,
    };

    const renderChildren = (
        <Container className={classes.container} {...containerProps} style={containerStyle}>
            {children}
        </Container>
    );

    const renderBottomNavbar =
        isMobileOrTablet && (customBottomNavbar || (!!userMe && !disableBottomNavbar && <BottomNavbar />));

    const renderFooter = !isMobileOrTablet && !disableFooter && <Footer />;
    const renderNotifications = <Notifications />;
    const renderAttachmentViewer = <AttachmentViewer />;
    const renderCommentThreadModal = <CommentThreadModal />;
    const renderSettingsModal = <SettingsModal />;
    const renderLanguageSelectorModal = <LanguageSelectorModal />;

    return (
        <Grid container direction="column" className={classes.root} {...props}>
            {renderHead}
            {renderTopNavbar}
            {renderChildren}
            {renderBottomNavbar}
            {renderFooter}
            {renderNotifications}
            {renderAttachmentViewer}
            {renderCommentThreadModal}
            {renderSettingsModal}
            {renderLanguageSelectorModal}
        </Grid>
    );
};
