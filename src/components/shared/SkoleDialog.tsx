import { Dialog, DialogProps, makeStyles, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import clsx from 'clsx';
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
  alwaysBorderRadius: {
    borderRadius: BORDER_RADIUS,
  },
}));

interface Props extends DialogProps {
  paperClasses?: string;
}

// A simple wrapper around MUI dialog to provide responsive styles consistently for all dialogs.
export const SkoleDialog: React.FC<Props> = ({ fullScreen, paperClasses, ...props }) => {
  const classes = useStyles();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const handleClick = (e: SyntheticEvent): void => e.stopPropagation();

  return (
    <Dialog
      onClick={handleClick}
      fullScreen={fullScreen === false ? fullScreen : isMobile}
      fullWidth={isTabletOrDesktop}
      TransitionComponent={Transition}
      PaperProps={{
        className: clsx(
          paperClasses,
          classes.paper,
          fullScreen === false && classes.alwaysBorderRadius,
        ),
      }}
      {...props}
    />
  );
};
