import { IconButton, IconButtonProps, Tooltip } from '@material-ui/core';
import { StarBorderOutlined } from '@material-ui/icons';
import { useState } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { PerformStarMutation, usePerformStarMutation } from '../../../generated/graphql';
import { useAuthContext, useNotificationsContext } from '../../context';

interface Props extends IconButtonProps {
    starred: boolean;
    course?: string;
    resource?: string;
}

export const StarButton: React.FC<Props> = ({ starred: initialStarred, course, resource }) => {
    const { t } = useTranslation();
    const { verified, verificationRequiredTooltip } = useAuthContext();
    const [starred, setStarred] = useState(initialStarred);
    const { toggleNotification } = useNotificationsContext();

    const tooltip = !!verificationRequiredTooltip
        ? verificationRequiredTooltip
        : starred
        ? t('tooltips:unstar')
        : t('tooltips:star') || '';

    const onError = (): void => {
        toggleNotification(t('notifications:starError'));
    };

    const onCompleted = ({ performStar }: PerformStarMutation): void => {
        if (!!performStar) {
            if (!!performStar.errors) {
                onError();
            } else {
                setStarred(performStar.starred as boolean);
            }
        }
    };

    const [performStar, { loading: starSubmitting }] = usePerformStarMutation({ onCompleted, onError });

    const handleStar = (): void => {
        performStar({ variables: { course, resource } });
    };

    return (
        <Tooltip title={tooltip}>
            <span>
                <IconButton
                    onClick={handleStar}
                    color={starred ? 'primary' : 'default'}
                    disabled={starSubmitting || verified === false}
                    size="small"
                >
                    <StarBorderOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );
};
