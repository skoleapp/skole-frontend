import { Grid, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import React from 'react';
import { DialogHeaderProps } from 'types';

const useStyles = makeStyles(({ spacing }) => ({
    root: {
        padding: spacing(2),
    },
}));

export const DialogHeader: React.FC<DialogHeaderProps> = ({ text, onCancel, headerRight }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const renderCloseButton = (
        <Tooltip title={t('common:close')}>
            <IconButton onClick={onCancel} size="small">
                <CloseOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderHeaderText = (
        <Typography className="MuiCardHeader-title" variant="h5">
            {text}
        </Typography>
    );

    return (
        <Grid container alignItems="center" className={classes.root}>
            <Grid item xs={2} container justify="flex-start">
                {renderCloseButton}
            </Grid>
            <Grid item container xs={8} justify="center">
                {renderHeaderText}
            </Grid>
            <Grid item container xs={2} justify="flex-end">
                {headerRight}
            </Grid>
        </Grid>
    );
};