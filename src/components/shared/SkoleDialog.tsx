import { Dialog, DialogProps, makeStyles, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { useMediaQueries } from 'hooks';
import React, { forwardRef, Ref } from 'react';
import { BORDER_RADIUS } from 'theme';

const Transition = forwardRef((props: TransitionProps, ref: Ref<unknown>) => (
    <Slide direction="up" ref={ref} {...props} />
));

const useStyles = makeStyles(({ breakpoints }) => ({
    paper: {
        [breakpoints.up('lg')]: {
            borderRadius: BORDER_RADIUS,
        },
    },
}));

// A simple wrapper around MUI dialog to provide global styles that cannot be provided in the theme overrides.
export const SkoleDialog: React.FC<DialogProps> = props => {
    const classes = useStyles();
    const { isMobileOrTablet, isDesktop } = useMediaQueries();

    return (
        <Dialog
            fullScreen={isMobileOrTablet}
            fullWidth={isDesktop}
            TransitionComponent={Transition}
            classes={{ paper: classes.paper }}
            {...props}
        />
    );
};
