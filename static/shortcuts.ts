import { HIGH_SCHOOL, UNIVERSITY, UNIVERSITY_OF_APPLIED_SCIENCES } from './schoolTypes';

const schoolShortcutsData = {
  highSchool: {
    text: 'High School',
    iconName: 'school',
    href: {
      pathname: '/search-courses',
      query: { school_type: HIGH_SCHOOL }
    }
  },
  university: {
    text: 'University',
    iconName: 'graduation-cap',
    href: {
      pathname: '/search-courses',
      query: { school_type: UNIVERSITY }
    }
  },
  universityOfAppliedSciences: {
    text: 'University of Applied Sciences',
    iconName: 'chalkboard',
    href: {
      pathname: '/search-courses',
      query: { school_type: UNIVERSITY_OF_APPLIED_SCIENCES }
    }
  }
};

const { highSchool, university, universityOfAppliedSciences } = schoolShortcutsData;
export const schoolShortcuts = [highSchool, university, universityOfAppliedSciences];

const actionShortcutsData = {
  searchCourses: {
    text: 'Search Courses',
    iconName: 'chalkboard-teacher',
    href: { pathname: '/search-courses' }
  },
  uploadResource: {
    text: 'Upload Resource',
    iconName: 'sticky-note',
    href: { pathname: '/upload-resource' }
  },
  createCourse: {
    text: 'Create Course',
    iconName: 'plus-circle',
    href: { pathname: '/create-course' }
  }
};

const { searchCourses, uploadResource, createCourse } = actionShortcutsData;
export const actionShortcuts = [searchCourses, uploadResource, createCourse];
