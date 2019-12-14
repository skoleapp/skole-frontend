import { Button } from '@material-ui/core';
import React from 'react';
import { UseFilters } from '../../interfaces';

interface Props extends Pick<UseFilters, 'toggleFilters'> {
  title: string;
}

export const FilterButton: React.FC<Props> = ({ toggleFilters, title }) => (
  <Button variant="contained" color="primary" onClick={toggleFilters(true)} fullWidth>
    {title}
  </Button>
);
