import { IconButton } from '@material-ui/core';
import { StarBorderOutlined } from '@material-ui/icons';
import { useState } from 'react';
import React from 'react';
import { useNotificationsContext } from 'src/utils';

import { PerformStarMutation, usePerformStarMutation } from '../../../generated/graphql';
import { useTranslation } from '../../i18n';
import { MuiColor } from '../../types';

interface Props {
    starred: boolean;
    course?: string;
    resource?: string;
}

export const StarButton: React.FC<Props> = ({ starred: initialStarred, course, resource }) => {
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
        <IconButton
            onClick={handleStar}
            color={starred ? 'primary' : ('default' as MuiColor)}
            disabled={starSubmitting}
            size="small"
        >
            <StarBorderOutlined />
        </IconButton>
    );
};
