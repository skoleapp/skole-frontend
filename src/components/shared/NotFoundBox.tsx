import { Grid, makeStyles, Typography } from '@material-ui/core';
import { MoodBadOutlined } from '@material-ui/icons';
import React from 'react';

import { TextLink } from './TextLink';

const useStyles = makeStyles(({ palette, spacing }) => ({
    root: {
        flexGrow: 1,
        backgroundColor: palette.common.white,
        padding: spacing(2),
        textAlign: 'center',
    },
    icon: {
        width: '3.5rem',
        height: '3.5rem',
        marginBottom: spacing(2),
    },
}));

interface Props {
    text: string;
    linkProps?: {
        href: string;
        text: string;
    };
}

export const NotFoundBox: React.FC<Props> = ({ text, linkProps }) => {
    const classes = useStyles();
    const renderIcon = <MoodBadOutlined className={classes.icon} color="disabled" />;
    const renderLink = !!linkProps && <TextLink href={linkProps.href}>{linkProps.text}</TextLink>;

    const renderText = (
        <Typography variant="body2" color="textSecondary">
            {text}
        </Typography>
    );

    return (
        <Grid container direction="column" justify="center" alignItems="center" className={classes.root}>
            {renderIcon}
            {renderText}
            {renderLink}
        </Grid>
    );
};
