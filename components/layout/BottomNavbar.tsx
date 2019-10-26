import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import RestoreIcon from '@material-ui/icons/Restore';
import React, { useState } from 'react';
import styled from 'styled-components';
import { SM } from '../../utils';

const StyledBottomNavbar = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 0.05rem solid var(--primary);

  @media only screen and (min-width: ${SM}) {
    display: none;
  }
`;

export const BottomNavbar: React.FC = () => {
  const [value, setValue] = useState(0);

  return (
    <StyledBottomNavbar>
      <BottomNavigation
        value={value}
        onChange={(_e, newValue): void => setValue(newValue)}
        showLabels
        className="root"
      >
        <BottomNavigationAction label="Account" icon={<RestoreIcon />} />
        <BottomNavigationAction label="Resource" icon={<LocationOnIcon />} />
        <BottomNavigationAction label="Courses" icon={<FavoriteIcon />} />
      </BottomNavigation>
    </StyledBottomNavbar>
  );
};
