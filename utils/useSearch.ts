import { useRouter } from 'next/router';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

export const useSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const placeholder = 'Search Courses...';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    router.push({ pathname: '/search', query: { courseName: searchValue } });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => setSearchValue(e.target.value);

  return { searchValue, handleSubmit, handleChange, placeholder };
};
