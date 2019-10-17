import React, { useState } from 'react';
import * as R from 'ramda';

const schools = [
  {
    id: 'Turun yliopisto',
    faculty: [
      { id: 'Humanistinen tiedekunta' },
      { id: 'Kasvatustieteiden tiedekunta' },
      {
        id: 'Luonnontieteiden ja tekniikan tiedekunta',
        facility: [
          { id: 'Biokemian laitos' },
          { id: 'Biologian laitos' },
          { id: 'Fysiikan ja tähtitieteen laitos' },
          { id: 'Kemian laitos' },
          { id: 'Maantieteen ja geologian laitos' },
          { id: 'Matematiikan ja tilastotieteen laitos' },
          { id: 'Tulevaisuuden teknologioiden laitos' }
        ]
      },
      { id: 'Lääketieteellinen tiedekunta' },
      { id: 'Oikeustieteellinen tiedekunta' },
      { id: 'Turun kauppakorkeakoulu' },
      { id: 'Yhteiskuntatieteellinen tiedekunta' }
    ]
  },
  { id: 'Åbo Akademi', faculty: [{ id: 'Department of Gender Studies' }] },
  { id: 'Aalto-yliopisto', faculty: [{ id: 'lute' }, { id: 'kauppis' }] },
  { id: 'Helsingin yliopisto', faculty: [{ id: 'lute' }, { id: 'kauppis' }] },
  {
    id: 'Tampereen teknillinen yliopisto',
    faculty: [{ id: 'lute' }, { id: 'kauppis' }]
  },
  { id: 'Oulun yliopisto', faculty: [{ id: 'lute' }, { id: 'kauppis' }] },
  { id: 'Vaasan yliopisto', faculty: [{ id: 'lute' }, { id: 'kauppis' }] },
  {
    id: 'Lappeenrannan–Lahden teknillinen yliopisto',
    faculty: [{ id: 'lute' }, { id: 'kauppis' }]
  }
];

interface Props {
  schoolType: string;
}
interface SchoolRowProps {
  index: number;
  school: any;
  handleSchoolSelection: (index: number) => void;
  selectedSchool: number;
}
interface FacultyRowProps {
  key: string | number;
  index: number;
  faculty: any;
  handleFacultySelection: (index: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  selectedFaculty: number;
}

const FacultyRow: React.FC<FacultyRowProps> = ({
  faculty,
  index,
  handleFacultySelection,
  selectedFaculty
}) => {
  const isExpanded = selectedFaculty === index ? true : false;

  const facilities = R.props(['id', 'facility'], faculty);
  console.log(facilities);
  return (
    <div
      onClick={e => handleFacultySelection(index, e)}
      style={{
        backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#f9f9f9',
        padding: '20px 10px',
        boxSizing: 'border-box',
        textAlign: 'left',
        userSelect: 'none',
        cursor: 'pointer'
      }}
    >
      <div>{R.prop('id', faculty)}</div>
      {isExpanded ? (
        <div
          style={{
            margin: 20,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div>
            {facilities.map((facility: any, index: number) => {
              return <div key={index}>{R.prop('id', facility)}</div>;
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const SchoolRow: React.FC<SchoolRowProps> = ({
  school,
  index,
  handleSchoolSelection,
  selectedSchool
}) => {
  const isExpanded = selectedSchool === index ? true : false;

  const [selectedFaculty, setSelectedFaculty] = useState();
  const handleFacultySelection = (
    index: number,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (index === selectedFaculty) {
      setSelectedFaculty(null);
    } else {
      setSelectedFaculty(index);
    }
  };

  return (
    <div
      onClick={() => handleSchoolSelection(index)}
      style={{
        backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#f9f9f9',
        padding: '20px',
        textAlign: 'left',
        userSelect: 'none',
        cursor: 'pointer'
      }}
    >
      <div>{R.prop('id', school)}</div>
      {isExpanded ? (
        <div
          style={{
            margin: '20px 10px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {school.faculty.map((faculty: any, index: number) => (
            <FacultyRow
              key={index}
              faculty={faculty}
              index={index}
              handleFacultySelection={handleFacultySelection}
              selectedFaculty={selectedFaculty}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const ListingPage: React.FC<Props> = () => {
  const [selectedSchool, setSelectedSchool] = useState();

  const handleSchoolSelection = (index: number) => {
    if (index === selectedSchool) {
      setSelectedSchool(null);
    } else {
      setSelectedSchool(index);
    }
  };
  return (
    <div style={{ marginTop: '20px', border: '2px solid #e0e0e0' }}>
      {schools.map((school: any, index: number) => (
        <SchoolRow
          key={index}
          school={school}
          index={index}
          handleSchoolSelection={handleSchoolSelection}
          selectedSchool={selectedSchool}
        />
      ))}
    </div>
  );
};
