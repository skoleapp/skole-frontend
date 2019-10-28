import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Typography } from '@material-ui/core';
import { ListingToolboxProps } from '../../interfaces';

export const ListingToolbox: React.FC<ListingToolboxProps> = ({
  search,
  setSearch,
  selectedSchoolType,
  handleSwitch
}) => {
  return (
    //fix these ugly containers and the input jeez
    <div style={{ width: '100%', display: 'flex' }}>
      <input
        value={search}
        onChange={e => setSearch(e.currentTarget.value)}
        style={{ flex: '0 0 30%' }}
      ></input>
      <ToggleButtonGroup
        style={{
          width: '100%',
          display: 'flex',
          backgroundColor: 'white',
          justifyContent: 'flex-end'
        }}
        value={selectedSchoolType}
        exclusive
        onChange={handleSwitch}
      >
        <ToggleButton style={{ width: '100%' }} value="University">
          <Typography>Universities</Typography>
        </ToggleButton>
        <ToggleButton style={{ width: '100%' }} value="AMKs">
          <Typography>Universities of Applied Sciences</Typography>
        </ToggleButton>
        <ToggleButton style={{ width: '100%' }} value="HighSchools">
          <Typography>High Schools</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};
