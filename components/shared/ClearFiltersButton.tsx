import { Button } from '@material-ui/core';
import { Router } from '../../i18n';
import React from 'react';

interface Props {
  resetForm: () => void;
}

export const ClearFiltersButton: React.FC<Props> = ({ resetForm }) => {
  // Clear the query params and reset form.
  const handleClearFilters = async () => {
    await Router.push(Router.pathname);
    resetForm();
  };

  return (
    <Button variant="outlined" color="primary" fullWidth onClick={handleClearFilters}>
      clear filters
    </Button>
  );
};
