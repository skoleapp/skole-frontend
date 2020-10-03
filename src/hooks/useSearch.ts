import { InputProps } from '@material-ui/core';
import { useAuthContext } from 'context';
import { useTranslation } from 'lib';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { UrlObject } from 'url';
import { redirect, urls } from 'utils';

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
    const autocomplete = 'off';
    const fullWidth = true;

    // Construct a query from user's selected school and subject.
    const school = R.pathOr(undefined, ['school', 'id'], userMe);
    const subject = R.pathOr(undefined, ['subject', 'id'], userMe);
    const query: ParsedUrlQueryInput = R.pickBy((val: string): boolean => !!val, { school, subject });
    const searchUrl = { pathname: urls.search, query };

    const handleSubmit = (e: SyntheticEvent): void => {
        e.preventDefault();
        setValue('');
        redirect({ ...searchUrl, query: { ...searchUrl.query, courseName: value } });
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>): void => setValue(e.target.value);

    return { handleSubmit, searchUrl, inputProps: { value, onChange, placeholder, autocomplete, fullWidth } };
};
