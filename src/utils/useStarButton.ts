import { Size } from '@material-ui/core';
import { useState } from 'react';

import { MuiColor } from '../types';

interface UseStarButton {
    onClick: () => void;
    color: MuiColor;
    size: Size;
}

export const useStarButton = (): UseStarButton => {
    const [starred, setStarred] = useState(false);
    const handleStar = (): void => setStarred(!starred);

    return {
        onClick: handleStar,
        color: starred ? 'primary' : ('default' as MuiColor),
        size: 'small',
    };
};
