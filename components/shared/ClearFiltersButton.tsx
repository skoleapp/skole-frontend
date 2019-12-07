import { Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';

interface Props {
  resetForm: () => void;
}

export const ClearFiltersButton: React.FC<Props> = ({ resetForm }) => {
  const router = useRouter();

  // Clear the query params and reset form.
  const handleClearFilters = async () => {
    await router.push(router.pathname);
    resetForm();
  };

  return (
    <Button variant="outlined" color="primary" fullWidth onClick={handleClearFilters}>
      clear filters
    </Button>
  );
};
