import { useState } from 'react';
import { UseFilters } from '../interfaces';

export const useFilters = (): UseFilters => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const toggleFilters = (open: boolean) => () => setFiltersOpen(open);
  return { filtersOpen, setFiltersOpen, toggleFilters };
};
