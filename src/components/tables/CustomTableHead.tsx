import { TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { useMediaQueries } from 'hooks';
import React from 'react';
import { CustomTableHeadProps, TextColor, TextVariant } from 'types';

const titleProps = {
  variant: 'subtitle2' as TextVariant,
  color: 'textSecondary' as TextColor,
};

export const CustomTableHead: React.FC<CustomTableHeadProps> = ({
  titleLeft,
  titleLeftDesktop = titleLeft,
  titleRight,
}) => {
  const { isMobile } = useMediaQueries();
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
