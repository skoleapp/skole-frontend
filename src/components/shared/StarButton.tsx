import { IconButton } from '@material-ui/core';
import { StarOutlined } from '@material-ui/icons';
import { useState } from 'react';
import React from 'react';

import { MuiColor } from '../../types';

export const StarButton: React.FC = () => {
    const [starred, setStarred] = useState(false);
    const handleStar = (): void => setStarred(!starred);

    return (
        <IconButton onClick={handleStar} color={starred ? 'primary' : ('default' as MuiColor)} size="small">
            <StarOutlined />
        </IconButton>
    );
};
