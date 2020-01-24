import { CourseObjectType } from '../../generated/graphql';

export const getFullCourseName = (course: CourseObjectType): string => {
    const { code, name } = course;

    if (code && name) {
        return `${course.code} ${course.name}`;
    } else {
        return course.name || 'N/A';
    }
};
