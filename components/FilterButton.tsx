import { Button } from '@material-ui/core';
import React from 'react';
import { UseFilters } from '../interfaces';

type Props = Pick<UseFilters, 'toggleFilters'>;

export const FilterButton: React.FC<Props> = ({ toggleFilters }) => (
  <Button variant="contained" color="primary" onClick={toggleFilters(true)} fullWidth>
    filters
  </Button>
);
