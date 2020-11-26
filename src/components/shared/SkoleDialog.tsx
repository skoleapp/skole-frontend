import { Dialog, DialogProps, makeStyles, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { useMediaQueries } from 'hooks';
import React, { forwardRef, Ref, SyntheticEvent } from 'react';
import { BORDER_RADIUS } from 'theme';

const Transition = forwardRef((props: TransitionProps, ref: Ref<unknown>) => (
  <Slide direction="up" ref={ref} {...props} />
));

const useStyles = makeStyles(({ breakpoints }) => ({
  paper: {
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
}));

// A simple wrapper around MUI dialog to provide global styles that cannot be provided in the theme overrides.
export const SkoleDialog: React.FC<DialogProps> = (props) => {
  const classes = useStyles();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const handleClick = (e: SyntheticEvent): void => e.stopPropagation();

  return (
    <Dialog
      onClick={handleClick}
      fullScreen={isMobile}
      fullWidth={isTabletOrDesktop}
      TransitionComponent={Transition}
      PaperProps={{ className: classes.paper }}
      {...props}
    />
  );
};
