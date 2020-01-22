import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Router } from '../i18n';

interface UseSearch {
    searchValue: string;
    handleSubmit: (e: SyntheticEvent) => void;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

export const useSearch = (): UseSearch => {
    const [searchValue, setSearchValue] = useState('');
    const { t } = useTranslation();
    const placeholder = t('forms:searchCourses');

    const handleSubmit = (e: SyntheticEvent): void => {
        e.preventDefault();
        Router.push({ pathname: '/search', query: { courseName: searchValue } });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => setSearchValue(e.target.value);

    return { searchValue, handleSubmit, handleChange, placeholder };
};
