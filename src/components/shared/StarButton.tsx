import { IconButton } from '@material-ui/core';
import { StarOutlined } from '@material-ui/icons';
import { useState } from 'react';
import React from 'react';

import { PerformStarMutation, usePerformStarMutation } from '../../../generated/graphql';
import { useSkoleContext } from '../../context';
import { useTranslation } from '../../i18n';
import { MuiColor } from '../../types';

interface Props {
    starred: boolean;
    course?: string;
    resource?: string;
}

export const StarButton: React.FC<Props> = ({ starred: initialStarred, course, resource }) => {
    const [starred, setStarred] = useState(initialStarred);
    const { toggleNotification } = useSkoleContext();
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
            <StarOutlined />
        </IconButton>
    );
};
