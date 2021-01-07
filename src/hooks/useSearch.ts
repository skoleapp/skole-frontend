import { InputProps } from '@material-ui/core/Input';
import { useAuthContext } from 'context';
import { useTranslation } from 'lib';
import Router from 'next/router';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { UrlObject } from 'url';
import { urls } from 'utils';

interface SearchUrl extends UrlObject {
  query: Record<symbol, unknown>;
}

interface UseSearch {
  handleSubmitSearch: (e: SyntheticEvent) => void;
  searchUrl: SearchUrl;
  searchInputProps: InputProps;
}

export const useSearch = (): UseSearch => {
  const { t } = useTranslation();
  const { school } = useAuthContext();
  const [value, setValue] = useState('');
  const placeholder = t('forms:searchCourses');
  const autoComplete = 'off';
  const fullWidth = true;
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => setValue(e.target.value);

  const searchUrl = {
    pathname: urls.search,
    query: school ? { school: school.id } : {},
  };

  const handleSubmitSearch = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setValue('');
    await Router.push({ ...searchUrl, query: { ...searchUrl.query, courseName: value } });
  };

  return {
    handleSubmitSearch,
    searchUrl,
    searchInputProps: { value, onChange, placeholder, autoComplete, fullWidth },
  };
};
