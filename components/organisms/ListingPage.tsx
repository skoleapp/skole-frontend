import React, { useState } from 'react';
import { ListingToolbox } from '../molecules/ListingToolbox';
import { ListingRows } from '../molecules/ListingRows';

//mock-data in json format
import { Universities, AMKs, HighSchools } from '../../utils/schools';

export const ListingPage: React.FC = () => {
  const [search, setSearch] = useState();
  const [selectedSchool, setSelectedSchool] = useState(-1);
  const [selectedFaculty, setSelectedFaculty] = useState(-1);
  const [selectedSchoolType, setSelectedSchoolType] = useState(Universities);

  const resetTable = () => {
    setSelectedSchool(-1);
    setSelectedFaculty(-1);
  };

  const handleSwitch = (_event: React.MouseEvent<HTMLElement, MouseEvent>, newSchoolType: any) => {
    switch (newSchoolType) {
      case 'University': {
        resetTable();
        setSelectedSchoolType(Universities);
        return;
      }
      case 'AMKs': {
        resetTable();
        setSelectedSchoolType(AMKs);
        return;
      }
      case 'HighSchools': {
        resetTable();
        setSelectedSchoolType(HighSchools);
        return;
      }
      default: {
        return null;
      }
    }
  };

  const handleSchoolSelection = (index: number) => {
    index === selectedSchool ? setSelectedSchool(-1) : setSelectedSchool(index);
  };

  return (
    // todo: fix styling
    <div style={{ marginTop: '20px', border: '2px solid #e0e0e0' }}>
      <ListingToolbox
        search={search}
        setSearch={setSearch}
        handleSwitch={handleSwitch}
        selectedSchoolType={selectedSchoolType}
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
