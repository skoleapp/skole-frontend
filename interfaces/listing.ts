export interface SchoolRowProps {
  index: number;
  school: any;
  handleSchoolSelection: (index: number) => void;
  selectedSchool: number;
  selectedFaculty: number;
  setSelectedFaculty: (index: number) => void;
}
export interface FacultyRowProps {
  index: number;
  faculty: any;
  handleFacultySelection: (index: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  selectedFaculty: number;
}
export interface ListingToolboxProps {
  search: string;
  setSearch: (value: string) => void;
  selectedSchoolType: any;
  handleSwitch: (_event: React.MouseEvent<HTMLElement, MouseEvent>, newSchoolType: any) => void;
}

export interface SchoolProps {
  Universities: any;
  UAS: any;
  HighSchools: any;
}
