import { TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { useDeviceContext } from 'context';
import React from 'react';
import { CustomTableHeadProps, TextColor, TextVariant } from 'types';

const titleProps = {
    variant: 'body2' as TextVariant,
    color: 'textSecondary' as TextColor,
};

export const CustomTableHead: React.FC<CustomTableHeadProps> = ({
    titleLeft,
    titleLeftDesktop = titleLeft,
    titleRight,
}) => {
    const isMobile = useDeviceContext();
    const renderTitleLeft = isMobile ? titleLeft : titleLeftDesktop;

    return (
        <TableHead>
            <TableRow>
                <TableCell>
                    <Typography {...titleProps}>{renderTitleLeft}</Typography>
                </TableCell>
                <TableCell align="right">
                    <Typography {...titleProps}>{titleRight}</Typography>
                </TableCell>
            </TableRow>
        </TableHead>
    );
};
