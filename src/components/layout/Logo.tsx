import { makeStyles } from '@material-ui/core';
import { Link } from 'lib';
import React from 'react';
import { urls } from 'utils';

const useStyles = makeStyles({
    root: {
        cursor: 'pointer',
        height: '1.25rem',
    },
});

export const Logo: React.FC = () => {
    const classes = useStyles();

    return (
        <Link href={urls.home}>
            <img className={classes.root} src="/images/icons/skole-icon-text.svg" />
        </Link>
    );
};
