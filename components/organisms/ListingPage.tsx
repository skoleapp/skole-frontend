import React, { useState } from 'react';
import { ListingToolbox } from '../molecules/ListingToolbox';
import { ListingRows } from '../molecules/ListingRows';
import { SchoolProps } from '../../interfaces';

export const ListingPage: React.FC<SchoolProps> = ({ Universities, UAS, HighSchools }) => {
  const [search, setSearch] = useState();
  const [selectedSchool, setSelectedSchool] = useState(-1);
  const [selectedFaculty, setSelectedFaculty] = useState(-1);
  const [selectedSchoolType, setSelectedSchoolType] = useState(Universities);

  const resetTable = () => {
    setSelectedSchool(-1);
    setSelectedFaculty(-1);
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
    // todo: fix styling
    <div style={{ marginTop: '20px', border: '2px solid #e0e0e0' }}>
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
        <ListingRows
          key={index}
          school={school}
          index={index}
          handleSchoolSelection={handleSchoolSelection}
          selectedSchool={selectedSchool}
          selectedFaculty={selectedFaculty}
          setSelectedFaculty={setSelectedFaculty}
        />
      ))}
    </div>
  );
};
