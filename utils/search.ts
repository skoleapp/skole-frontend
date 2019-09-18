import Router from 'next/router';
import { SearchCoursesValueType } from '../interfaces';

export const onSubmitSearchCourses = (values: SearchCoursesValueType): void => {
  const { search } = values;
  Router.push({ pathname: '/search', query: { search } });
};
