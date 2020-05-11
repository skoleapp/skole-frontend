import { IconButton, Tooltip } from '@material-ui/core';
import { StarBorderOutlined } from '@material-ui/icons';
import { useState } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { PerformStarMutation, usePerformStarMutation } from '../../../generated/graphql';
import { useAuthContext, useNotificationsContext } from '../../context';
import { MuiColor } from '../../types';

interface Props {
    starred: boolean;
    course?: string;
    resource?: string;
    starredTooltip?: string;
    unstarredTooltip?: string;
}

export const StarButton: React.FC<Props> = ({
    starred: initialStarred,
    course,
    resource,
    starredTooltip,
    unstarredTooltip,
}) => {
    const { t } = useTranslation();
    const { verified, notVerifiedTooltip } = useAuthContext();
    const [starred, setStarred] = useState(initialStarred);
    const { toggleNotification } = useNotificationsContext();
    const tooltip = !!notVerifiedTooltip ? notVerifiedTooltip : starred ? starredTooltip : unstarredTooltip || '';

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
                    color={starred ? 'primary' : ('default' as MuiColor)}
                    disabled={starSubmitting || verified === false}
                    size="small"
                >
                    <StarBorderOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );
};
