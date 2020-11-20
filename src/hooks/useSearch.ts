import { InputProps } from '@material-ui/core';
import { useAuthContext } from 'context';
import { useTranslation } from 'lib';
import Router from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { UrlObject } from 'url';
import { urls } from 'utils';

interface SearchUrl extends UrlObject {
  query: ParsedUrlQueryInput;
}

interface UseSearch {
  handleSubmit: (e: SyntheticEvent) => void;
  searchUrl: SearchUrl;
  inputProps: InputProps;
}

export const useSearch = (): UseSearch => {
  const [value, setValue] = useState('');
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const placeholder = t('forms:searchCourses');
  const autoComplete = 'off';
  const fullWidth = true;

  // Construct a query from user's selected school and subject.
  const school = R.path(['school', 'id'], userMe);
  const subject = R.path(['subject', 'id'], userMe);

  const query: ParsedUrlQueryInput = R.pickBy((val: string): boolean => !!val, {
    school,
    subject,
  });

  const searchUrl = { pathname: urls.search, query };

  const onChange = (e: ChangeEvent<HTMLInputElement>): void =>
    setValue(e.target.value);

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setValue('');
    await Router.push({
      ...searchUrl,
      query: { ...searchUrl.query, courseName: value },
    });
  };

  return {
    handleSubmit,
    searchUrl,
    inputProps: { value, onChange, placeholder, autoComplete, fullWidth },
  };
};
