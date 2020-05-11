import { InputProps } from '@material-ui/core';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from 'src/context';
import { UrlObject } from 'url';

import { Router } from '../i18n';

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
    const { user } = useAuthContext();
    const placeholder = t('forms:searchCourses');
    const autoComplete = 'off';

    // Construct a query from user's selected school and subject.
    const school = R.pathOr(undefined, ['school', 'id'], user);
    const subject = R.pathOr(undefined, ['subject', 'id'], user);
    const query: ParsedUrlQueryInput = R.pickBy((val: string): boolean => !!val, { school, subject });
    const searchUrl = { pathname: '/search', query };

    const handleSubmit = (e: SyntheticEvent): void => {
        e.preventDefault();
        setValue('');
        Router.push({ ...searchUrl, query: { ...searchUrl.query, courseName: value } });
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>): void => setValue(e.target.value);

    return { handleSubmit, searchUrl, inputProps: { value, onChange, placeholder, autoComplete } };
};
