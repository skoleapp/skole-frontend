import { useRouter } from 'next/router';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const { t } = useTranslation();
  const placeholder = t('searchCourses');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    router.push({ pathname: '/search', query: { courseName: searchValue } });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => setSearchValue(e.target.value);

  return { searchValue, handleSubmit, handleChange, placeholder };
};
