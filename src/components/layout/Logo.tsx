import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(({ breakpoints }) => ({
    root: {
        height: '4rem',
        [breakpoints.up('sm')]: {
            height: '5rem',
        },
        [breakpoints.up('md')]: {
            height: '6rem',
        },
    },
}));

export const Logo: React.FC = () => {
    const classes = useStyles();
    return <img className={classes.root} src="/images/icons/skole-icon-text.svg" />;
};
