const schoolShortcutsData = {
  highSchool: {
    text: 'High School',
    iconName: 'school',
    href: {
      pathname: '/school',
      query: { school_type: 'high-school' } // eslint-disable-line
    }
  },
  university: {
    text: 'University',
    iconName: 'graduation-cap',
    href: {
      pathname: '/school',
      query: { school_type: 'university' } // eslint-disable-line
    }
  },
  universityOfAppliedSciences: {
    text: 'University of Applied Sciences',
    iconName: 'chalkboard',
    href: {
      pathname: '/school',
      query: { school_type: 'university-of-applied-sciences' } // eslint-disable-line
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
