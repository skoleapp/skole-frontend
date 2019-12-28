import { Course } from '../types';

export const getFullCourseName = (course: Course) => {
  const { code, name } = course;

  if (code && name) {
    return `${course.code} ${course.name}`;
  } else {
    return course.name || 'N/A';
  }
};
