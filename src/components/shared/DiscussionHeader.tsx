import { Box, Grid, Typography } from '@material-ui/core';
import { ChatOutlined } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const title = `${t('common:discussion')} (${commentCount})`;
    const renderIcon = <ChatOutlined />;

    const renderText = (
        <Box marginLeft="0.5rem">
            <Typography variant="subtitle1">{title}</Typography>
        </Box>
    );

    return (
        <Box className="custom-header">
            <Grid container justify="space-between">
                <Box display="flex" justifyContent="flex-start" alignItems="center">
                    {renderIcon} {renderText}
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
