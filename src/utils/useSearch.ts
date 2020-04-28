import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { useTranslation } from '../i18n';
import { Router } from '../i18n';

interface UseSearch {
    handleSubmit: (e: SyntheticEvent) => void;
    inputProps: {
        value: string;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        placeholder: string;
    };
}

export const useSearch = (): UseSearch => {
    const [value, setValue] = useState('');
    const { t } = useTranslation();
    const placeholder = t('forms:searchCourses');

    const handleSubmit = (e: SyntheticEvent): void => {
        e.preventDefault();
        setValue('');
        Router.push({ pathname: '/search', query: { courseName: value } });
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>): void => setValue(e.target.value);

    return { handleSubmit, inputProps: { value, onChange, placeholder } };
};
