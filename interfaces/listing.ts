export interface SchoolRowProps {
  index: number;
  school: any;
  selectedSchool: number;
  handleSchoolSelection: (index: number) => void;
}
export interface SubjectRowProps {
  index?: number;
  subject: any;
  schoolName: string;
  schoolId: number;
}
export interface ListingToolboxProps extends SchoolProps {
  search: string;
  handleSearch: (value: string) => void;
  selectedSchoolType: any;
  handleSwitch: (_event: React.MouseEvent<HTMLElement, MouseEvent>, newSchoolType: any) => void;
}

export interface SchoolProps {
  Universities: any;
  UAS: any;
  HighSchools: any;
}
