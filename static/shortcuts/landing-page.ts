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
