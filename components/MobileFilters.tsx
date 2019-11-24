import { Button, CardContent, CardHeader, SwipeableDrawer } from '@material-ui/core';
import React from 'react';
import { StyledCard } from '.';
import { UseFilters } from '../interfaces';

interface Props extends Omit<UseFilters, 'setFiltersOpen'> {
  title: string;
}

export const MobileFilters: React.FC<Props> = ({ title, filtersOpen, toggleFilters, children }) => (
  <SwipeableDrawer
    className="mobile-only"
    anchor="bottom"
    open={filtersOpen}
    onClose={toggleFilters(false)}
    onOpen={toggleFilters(true)}
  >
    <StyledCard>
      <CardHeader title={title} />
      <CardContent>
        {children}
        <Button variant="outlined" color="primary" fullWidth onClick={toggleFilters(!filtersOpen)}>
          cancel
        </Button>
      </CardContent>
    </StyledCard>
  </SwipeableDrawer>
);
