import { Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { forwardRef, Ref } from 'react';
import React from 'react';

export const Transition = forwardRef((props: TransitionProps, ref: Ref<unknown>) => (
    <Slide direction="up" ref={ref} {...props} />
));
