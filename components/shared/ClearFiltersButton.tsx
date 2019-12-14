import { Button } from '@material-ui/core';
import { Router } from '../../i18n';
import React from 'react';

interface Props {
  resetForm: () => void;
  title: string;
}

export const ClearFiltersButton: React.FC<Props> = ({ resetForm, title }) => {
  // Clear the query params and reset form.
  const handleClearFilters = async () => {
    await Router.push(Router.pathname);
    resetForm();
  };

  return (
    <Button variant="outlined" color="primary" fullWidth onClick={handleClearFilters}>
      {title}
    </Button>
  );
};
