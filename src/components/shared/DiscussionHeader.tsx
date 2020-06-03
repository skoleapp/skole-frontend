import { Box, Grid, Typography } from '@material-ui/core';
import { ChatOutlined } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    numComments: number;
    renderStarButton: JSX.Element;
    renderUpVoteButton: JSX.Element;
    renderDownVoteButton: JSX.Element;
    renderShareButton: JSX.Element;
    renderInfoButton: JSX.Element;
    renderActionsButton: JSX.Element;
}

export const DiscussionHeader: React.FC<Props> = ({
    numComments,
    renderStarButton,
    renderUpVoteButton,
    renderDownVoteButton,
    renderShareButton,
    renderInfoButton,
    renderActionsButton,
}) => {
    const { t } = useTranslation();
    const renderText = (
        <Typography className="custom-header-text" variant="subtitle1">{`${t(
            'common:discussion',
        )} (${numComments})`}</Typography>
    );

    return (
        <Box className="custom-header">
            <Grid container justify="space-between">
                <Box display="flex" justifyContent="flex-start" alignItems="center">
                    <ChatOutlined /> {renderText}
                </Box>
                <Box display="flex" justifyContent="flex-end" alignItems="center">
                    {renderStarButton}
                    {renderUpVoteButton}
                    {renderDownVoteButton}
                    {renderShareButton}
                    {renderInfoButton}
                    {renderActionsButton}
                </Box>
            </Grid>
        </Box>
    );
};
