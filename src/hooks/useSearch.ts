import { InputProps } from '@material-ui/core';
import { useAuthContext } from 'context';
import { useTranslation } from 'lib';
import Router from 'next/router';
import { UrlObject } from 'url';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { urls } from 'utils';
import * as R from 'ramda';

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
  const { userMe } = useAuthContext();
  const school = R.propOr(null, 'school', userMe);
  const [value, setValue] = useState('');
  const placeholder = t('forms:searchCourses');
  const autoComplete = 'off';
  const fullWidth = true;
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => setValue(e.target.value);
  const searchUrl = { pathname: urls.search, query: { school } };

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
