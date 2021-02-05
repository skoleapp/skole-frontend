import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import clsx from 'clsx';
import { useMediaQueries } from 'hooks';
import React, { forwardRef, Ref, SyntheticEvent } from 'react';
import { BORDER_RADIUS } from 'styles';
import { SkoleDialogProps } from 'types';

const Transition = forwardRef((props: TransitionProps, ref: Ref<unknown>) => (
  <Slide direction="up" ref={ref} {...props} />
));

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  paper: {
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  list: {
    [breakpoints.up('md')]: {
      paddingBottom: spacing(8),
    },
  },
  alwaysBorderRadius: {
    borderRadius: BORDER_RADIUS,
  },
}));

// A simple wrapper around MUI dialog to provide responsive styles consistently for all dialogs.
export const SkoleDialog: React.FC<SkoleDialogProps> = ({ fullScreen, list, ...props }) => {
  const classes = useStyles();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const handleClick = (e: SyntheticEvent): void => e.stopPropagation();

  const PaperProps = {
    className: clsx(
      classes.paper,
      list && classes.list,
      fullScreen === false && classes.alwaysBorderRadius,
    ),
  };

  return (
    <Dialog
      onClick={handleClick}
      fullScreen={fullScreen === false ? fullScreen : isMobile}
      fullWidth={isTabletOrDesktop}
      TransitionComponent={Transition}
      PaperProps={PaperProps}
      {...props}
    />
  );
};
