export interface UseFilters {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  toggleFilters: (open: boolean) => () => void;
}
