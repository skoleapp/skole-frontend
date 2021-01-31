import { InputProps } from '@material-ui/core/Input';
import { useAuthContext } from 'context';
import { useTranslation } from 'lib';
import Router, { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { UrlObject } from 'url';
import { urls } from 'utils';

interface SearchUrl extends Omit<UrlObject, 'query'> {
  query?: ParsedUrlQueryInput;
}

interface UseSearch {
  handleSubmitSearch: (e: SyntheticEvent) => void;
  searchUrl: SearchUrl;
  searchInputProps: InputProps;
}

export const useSearch = (): UseSearch => {
  const { t } = useTranslation();
  const { pathname } = useRouter();
  const { school } = useAuthContext();
  const [value, setValue] = useState('');
  const placeholder = t('forms:searchCourses');
  const autoComplete = 'off';
  const fullWidth = true;
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => setValue(e.target.value);

  const query = school
    ? {
        school: school.id,
      }
    : {};

  const searchUrl = {
    pathname: urls.search,
    query,
  };

  const handleSubmitSearch = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setValue('');
    await Router.push({ ...searchUrl, query: { ...searchUrl.query, courseName: value } });
    sa_event(`submit_search_${value}_from_${pathname}`);
  };

  return {
    handleSubmitSearch,
    searchUrl,
    searchInputProps: { value, onChange, placeholder, autoComplete, fullWidth },
  };
};
