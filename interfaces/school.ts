export interface SchoolType {
  id: string;
  name: string;
}

export interface School {
  id: string;
  schoolType: string;
  name: string;
  city: string;
  country: string;
  courseCount: number;
  subjectCount: number;
}
