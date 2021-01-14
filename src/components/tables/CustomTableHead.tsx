import { TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import { CustomTableHeadProps, TextColor, TextVariant } from 'types';

const titleProps = {
  variant: 'subtitle2' as TextVariant,
  color: 'textSecondary' as TextColor,
};

export const CustomTableHead: React.FC<CustomTableHeadProps> = ({ titleLeft, titleRight }) => (
  <TableHead>
    <TableRow>
      <TableCell>
        <Typography {...titleProps}>{titleLeft}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography {...titleProps}>{titleRight}</Typography>
      </TableCell>
    </TableRow>
  </TableHead>
);
