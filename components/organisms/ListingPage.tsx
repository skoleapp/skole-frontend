import React, { useState } from 'react';

const schools = [
  {
    id: 'Turun yliopisto',
    faculty: [
      { id: 'Humanistinen tiedekunta' },
      { id: 'Kasvatustieteiden tiedekunta' },
      { id: 'Luonnontieteiden ja tekniikan tiedekunta' },
      { id: 'Lääketieteellinen tiedekunta' },
      { id: 'Oikeustieteellinen tiedekunta' },
      { id: 'Turun kauppakorkeakoulu' },
      { id: 'Yhteiskuntatieteellinen tiedekunta' }
    ],
    kursseja: 33
  },
  { id: 'Åbo Akademi', faculty: [{ id: 'Department of Gender Studies' }], kursseja: 8 },
  { id: 'Aalto-yliopisto', faculty: [{ id: 'lute' }, { id: 'kauppis' }], kursseja: 6 },
  { id: 'Helsingin yliopisto', faculty: [{ id: 'lute' }, { id: 'kauppis' }], kursseja: 1 },
  {
    id: 'Tampereen teknillinen yliopisto',
    faculty: [{ id: 'lute' }, { id: 'kauppis' }],
    kursseja: 4
  },
  { id: 'Oulun yliopisto', faculty: [{ id: 'lute' }, { id: 'kauppis' }], kursseja: 2 },
  { id: 'Vaasan yliopisto', faculty: [{ id: 'lute' }, { id: 'kauppis' }], kursseja: 5 },
  {
    id: 'Lappeenrannan–Lahden teknillinen yliopisto',
    faculty: [{ id: 'lute' }, { id: 'kauppis' }],
    kursseja: 3
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
      {faculty.id}
      {isExpanded ? (
        <div
          style={{
            margin: 20,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          moi
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
  const handleFacultySelection = (index: number, e: any) => {
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
      <div>{school.id}</div>
      {isExpanded ? (
        <div
          style={{
            margin: '20px 10px',
            display: 'flex',
            flexDirection: 'column',
            border: '2px inset #e0e0e0',
            borderRight: 0,
            borderBottom: 0
          }}
        >
          {school.faculty.map((faculty: any, index: number) => (
            <FacultyRow
              key={faculty.id}
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
      {schools.map((school, index) => (
        <SchoolRow
          key={school.id}
          school={school}
          index={index}
          handleSchoolSelection={handleSchoolSelection}
          selectedSchool={selectedSchool}
        />
      ))}
    </div>
  );
};
