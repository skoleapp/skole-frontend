import React, { useState } from 'react';
import { ListingToolbox } from '../molecules/ListingToolbox';
import { SchoolRows } from '../molecules/SchoolRows';
import { SchoolProps } from '../../interfaces';
import styled from 'styled-components';

export const ListingPage: React.FC<SchoolProps> = ({ Universities, UAS, HighSchools }) => {
  const [search, setSearch] = useState();
  const [selectedSchool, setSelectedSchool] = useState(-1);
  const [selectedSchoolType, setSelectedSchoolType] = useState(Universities);

  const resetTable = () => {
    setSelectedSchool(-1);
  };

  const handleSwitch = (_event: React.MouseEvent<HTMLElement, MouseEvent>, newSchoolType: any) => {
    resetTable();
    if (!!newSchoolType) {
      setSelectedSchoolType(newSchoolType);
    }
  };

  const handleSearch = (value: any) => {
    setSearch(value);
  };

  const handleSchoolSelection = (index: number) => {
    index === selectedSchool ? setSelectedSchool(-1) : setSelectedSchool(index);
  };

  return (
    <StyledListingContainer>
      <ListingToolbox
        search={search}
        handleSearch={handleSearch}
        handleSwitch={handleSwitch}
        selectedSchoolType={selectedSchoolType}
        Universities={Universities}
        UAS={UAS}
        HighSchools={HighSchools}
      />
      {selectedSchoolType.map((school: any, index: number) => (
        <SchoolRows
          key={index}
          school={school}
          index={index}
          handleSchoolSelection={handleSchoolSelection}
          selectedSchool={selectedSchool}
        />
      ))}
    </StyledListingContainer>
  );
};

const StyledListingContainer = styled.div`
  margin-top: 1rem;
  border: 2px solid #e0e0e0;
`;
