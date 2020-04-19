import { IconButton } from '@material-ui/core';
import { StarBorderOutlined } from '@material-ui/icons';
import { useState } from 'react';
import React from 'react';

import { PerformStarMutation, usePerformStarMutation } from '../../../generated/graphql';
import { useNotificationsContext } from '../../context';
import { useTranslation } from '../../i18n';
import { MuiColor } from '../../types';
import { StyledTooltip } from './StyledTooltip';

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
    const [starred, setStarred] = useState(initialStarred);
    const { toggleNotification } = useNotificationsContext();
    const { t } = useTranslation();

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
        <StyledTooltip title={starred ? starredTooltip : unstarredTooltip || ''}>
            <span>
                <IconButton
                    onClick={handleStar}
                    color={starred ? 'primary' : ('default' as MuiColor)}
                    disabled={starSubmitting}
                    size="small"
                >
                    <StarBorderOutlined />
                </IconButton>
            </span>
        </StyledTooltip>
    );
};
