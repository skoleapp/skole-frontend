const coursesPageShortcutsData = {
  highSchool: {
    text: 'High School',
    iconName: 'school',
    href: '/courses/high-school'
  },
  university: {
    text: 'University',
    iconName: 'graduation-cap',
    href: '/courses/university'
  },
  universityOfAppliedSciences: {
    text: 'University of Applied Sciences',
    iconName: 'chalkboard',
    href: '/courses/university-of-applied-sciences'
  }
};

const { highSchool, university, universityOfAppliedSciences } = coursesPageShortcutsData;
export const coursesPageShortcuts = [highSchool, university, universityOfAppliedSciences];

const landingPageShortcutsData = {
  courses: {
    text: 'All Courses',
    iconName: 'chalkboard-teacher',
    href: '/courses'
  },
  uploadResource: {
    text: 'Upload Resource',
    iconName: 'sticky-note',
    href: '/upload-resource'
  },
  createCourse: {
    text: 'Create Course',
    iconName: 'plus-circle',
    href: '/create-course'
  }
};

const { courses, uploadResource, createCourse } = landingPageShortcutsData;
export const landingPageShortcuts = [courses, uploadResource, createCourse];
