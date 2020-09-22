import { Grid, makeStyles, Typography } from '@material-ui/core';
import { ChatOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import React from 'react';

const useStyles = makeStyles(({ spacing }) => ({
    icon: {
        marginRight: spacing(1),
    },
}));

interface Props {
    commentCount: number;
    renderStarButton: JSX.Element;
    renderUpVoteButton: JSX.Element;
    renderDownVoteButton: JSX.Element;
    renderShareButton: JSX.Element;
    renderInfoButton: JSX.Element;
    renderActionsButton: JSX.Element;
}

export const DiscussionHeader: React.FC<Props> = ({
    commentCount,
    renderStarButton,
    renderUpVoteButton,
    renderDownVoteButton,
    renderShareButton,
    renderInfoButton,
    renderActionsButton,
}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const title = `${t('common:discussion')} (${commentCount})`;
    const renderIcon = <ChatOutlined className={classes.icon} color="disabled" />;

    const renderText = (
        <Typography className="MuiCardHeader-subheader" variant="subtitle1" color="textSecondary">
            {title}
        </Typography>
    );

    return (
        <Grid container justify="space-between" className="MuiCardHeader-root">
            <Grid item xs={4} container alignItems="center">
                {renderIcon} {renderText}
            </Grid>
            <Grid item xs={8} container justify="flex-end">
                {renderStarButton}
                {renderUpVoteButton}
                {renderDownVoteButton}
                {renderShareButton}
                {renderInfoButton}
                {renderActionsButton}
            </Grid>
        </Grid>
    );
};
