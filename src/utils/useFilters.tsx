import { Button, FormControl } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Router } from '../i18n';
import { UseForm, useForm } from './useForm';

export interface UseFilters<T> extends UseForm<T> {
    submitButtonText: string;
    renderClearFiltersButton: JSX.Element;
    handleSubmit: (filteredValues: T) => Promise<void>;
    handleClearFilters: () => Promise<void>;
    open: boolean;
    toggleDrawer: (open: boolean) => () => void;
}

export const useFilters = <T extends {}>(): UseFilters<T> => {
    const { resetForm, setSubmitting, ...other } = useForm<T>();
    const [open, setOpen] = useState(false);
    const closeDrawer = (): void => setOpen(false);
    const toggleDrawer = (open: boolean) => (): void => setOpen(open);
    const { pathname } = useRouter();
    const { t } = useTranslation();
    const submitButtonText = t('common:apply');

    // Pick non-empty values and reload the page with new query params.
    const handleSubmit = async (filteredValues: {}): Promise<void> => {
        const query: ParsedUrlQueryInput = R.pickBy((val: string): boolean => !!val, filteredValues);
        await Router.push({ pathname, query });
        setSubmitting(false);
        closeDrawer();
    };

    // Clear the query params and reset form.
    const handleClearFilters = async (): Promise<void> => {
        await Router.push(pathname);
        resetForm();
        closeDrawer();
    };

    const renderClearFiltersButton = (
        <FormControl fullWidth>
            <Button onClick={handleClearFilters} variant="outlined" color="primary" endIcon={<Clear />} fullWidth>
                {t('common:clear')}
            </Button>
        </FormControl>
    );

    return {
        submitButtonText,
        handleSubmit,
        renderClearFiltersButton,
        open,
        toggleDrawer,
        handleClearFilters,
        resetForm,
        setSubmitting,
        ...other,
    };
};
