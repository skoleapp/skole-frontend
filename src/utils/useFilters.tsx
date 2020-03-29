import { Button, FormControl, IconButton } from '@material-ui/core';
import { Clear, ClearAllOutlined } from '@material-ui/icons';
import { FormikActions } from 'formik';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React from 'react';
import { useState } from 'react';

import { useTranslation } from '../i18n';
import { Router } from '../i18n';
import { UseForm, useForm } from './useForm';

export interface UseFilters<T> extends UseForm<T> {
    submitButtonText: string;
    renderMobileClearFiltersButton: JSX.Element;
    renderDesktopClearFiltersButton: JSX.Element;
    handleSubmit: (filteredValues: T, actions: FormikActions<T>) => Promise<void>;
    handleClearFilters: () => Promise<void>;
    open: boolean;
    toggleDrawer: (open: boolean) => () => void;
}

export const useFilters = <T extends {}>(): UseFilters<T> => {
    const { resetForm, setSubmitting, ...other } = useForm<T>();
    const [open, setOpen] = useState(false);
    const closeDrawer = (): void => setOpen(false);
    const toggleDrawer = (open: boolean) => (): void => setOpen(open);
    const { pathname, query } = useRouter();
    const { t } = useTranslation();
    const submitButtonText = t('common:apply');

    // Pick non-empty values and reload the page with new query params.
    const handleSubmit = async (filteredValues: {}, actions: FormikActions<T>): Promise<void> => {
        const validQuery: ParsedUrlQueryInput = R.pickBy((val: string): boolean => !!val, filteredValues);
        await Router.push({ pathname, query: validQuery });
        actions.setSubmitting(false);
        closeDrawer();
    };

    // Clear the query params and reset form.
    const handleClearFilters = async (): Promise<void> => {
        const queryWithPagination: ParsedUrlQueryInput = R.pickBy(
            (val: string, key: string): boolean => (!!val && key === 'page') || key === 'pageSize',
            query,
        );

        await Router.push({ pathname, query: queryWithPagination });
        resetForm();
        closeDrawer();
    };

    const renderMobileClearFiltersButton = (
        <IconButton onClick={handleClearFilters}>
            <ClearAllOutlined />
        </IconButton>
    );

    const renderDesktopClearFiltersButton = (
        <FormControl className="md-up" fullWidth>
            <Button onClick={handleClearFilters} variant="outlined" color="primary" endIcon={<Clear />} fullWidth>
                {t('common:clear')}
            </Button>
        </FormControl>
    );

    return {
        submitButtonText,
        handleSubmit,
        renderMobileClearFiltersButton,
        renderDesktopClearFiltersButton,
        open,
        toggleDrawer,
        handleClearFilters,
        resetForm,
        setSubmitting,
        ...other,
    };
};
