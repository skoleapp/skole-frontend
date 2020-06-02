import { Box, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    numComments: number;
    renderStarButton: JSX.Element;
    renderUpVoteButton: JSX.Element;
    renderDownVoteButton: JSX.Element;
    renderInfoButton: JSX.Element;
    renderActionsButton: JSX.Element;
}

export const DiscussionHeader: React.FC<Props> = ({
    numComments,
    renderStarButton,
    renderUpVoteButton,
    renderDownVoteButton,
    renderInfoButton,
    renderActionsButton,
}) => {
    const { t } = useTranslation();
    const renderText = <Typography variant="subtitle1">{`${t('common:discussion')} (${numComments})`}</Typography>;

    return (
        <Box className="custom-header">
            <Grid container alignItems="center">
                <Grid item xs={6} container justify="flex-start">
                    {renderText}
                </Grid>
                <Grid item xs={6} container justify="flex-end">
                    {renderStarButton}
                    {renderUpVoteButton}
                    {renderDownVoteButton}
                    {renderInfoButton}
                    {renderActionsButton}
                </Grid>
            </Grid>
        </Box>
    );
};
