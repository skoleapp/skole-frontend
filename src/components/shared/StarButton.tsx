import { IconButton, IconButtonProps, Tooltip, Typography } from '@material-ui/core';
import { StarBorderOutlined } from '@material-ui/icons';
import { useAuthContext, useNotificationsContext } from 'context';
import { PerformStarMutation, usePerformStarMutation } from 'generated';
import { useTranslation } from 'lib';
import React, { useState } from 'react';

interface Props extends IconButtonProps {
    starred: boolean;
    course?: string;
    resource?: string;
}

export const StarButton: React.FC<Props> = ({ starred: initialStarred, course, resource }) => {
    const { t } = useTranslation();
    const { verified, verificationRequiredTooltip } = useAuthContext();
    const [starred, setStarred] = useState(initialStarred);
    const color = starred ? 'primary' : 'default';
    const { toggleNotification } = useNotificationsContext();
    const tooltip = verificationRequiredTooltip || (starred ? t('tooltips:unstar') : t('tooltips:star') || '');
    const onError = (): void => toggleNotification(t('notifications:starError'));

    const onCompleted = ({ performStar }: PerformStarMutation): void => {
        if (!!performStar) {
            if (!!performStar.errors && !!performStar.errors.length) {
                onError();
            } else {
                setStarred(performStar.starred as boolean);
            }
        }
    };

    const [performStar, { loading: starSubmitting }] = usePerformStarMutation({ onCompleted, onError });

    const handleStar = async (): Promise<void> => {
        await performStar({ variables: { course, resource } });
    };

    return (
        <Tooltip title={tooltip}>
            <Typography component="span">
                <IconButton
                    onClick={handleStar}
                    disabled={starSubmitting || verified === false}
                    size="small"
                    color={color}
                >
                    <StarBorderOutlined />
                </IconButton>
            </Typography>
        </Tooltip>
    );
};
