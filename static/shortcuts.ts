const shortcutsData = {
  highSchool: {
    text: 'High School',
    iconName: 'school',
    href: {
      pathname: '/search-schools',
      query: {
        schoolType: 'high-school'
      }
    }
  },
  university: {
    text: 'University',
    iconName: 'graduation-cap',
    href: {
      pathname: '/search-schools',
      query: {
        schoolType: 'university'
      }
    }
  },
  universityOfAppliedSciences: {
    text: 'University of Applied Sciences',
    iconName: 'chalkboard',
    href: {
      pathname: '/search-schools',
      query: {
        schoolType: 'university-of-applied-sciences'
      }
    }
  }
};

const { highSchool, university, universityOfAppliedSciences } = shortcutsData;
export const shortcuts = [highSchool, university, universityOfAppliedSciences];
