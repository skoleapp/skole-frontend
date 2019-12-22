import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Router } from '../i18n';

export const useSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();
  const placeholder = t('common:searchCourses');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    Router.push({ pathname: '/search', query: { courseName: searchValue } });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => setSearchValue(e.target.value);

  return { searchValue, handleSubmit, handleChange, placeholder };
};
