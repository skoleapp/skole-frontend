import { Button, FormControl } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { FormikActions } from 'formik';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React from 'react';

import { useTranslation } from '../i18n';
import { Router } from '../i18n';
import { breakpointsNum } from '../styles';
import { UseFilters } from '../types';
import { useBreakPoint } from './useBreakPoint';
import { useDrawer } from './useDrawer';
import { useForm } from './useForm';

export const useFilters = <T extends {}>(): UseFilters<T> => {
    const { t } = useTranslation();
    const { resetForm, setSubmitting, ...other } = useForm<T>();
    const drawerProps = useDrawer(t('common:advancedSearch'));
    const { onClose: handleCloseDrawer } = drawerProps;
    const { pathname, query } = useRouter();
    const submitButtonText = t('common:apply');
    const isMobile = useBreakPoint(breakpointsNum.MD);

    // Pick non-empty values and reload the page with new query params.
    const handleSubmit = async (filteredValues: {}, actions: FormikActions<T>): Promise<void> => {
        const validQuery: ParsedUrlQueryInput = R.pickBy((val: string): boolean => !!val, filteredValues);
        await Router.push({ pathname, query: validQuery });
        actions.setSubmitting(false);
        handleCloseDrawer();
    };

    // Clear the query params and reset form.
    const handleClearFilters = async (): Promise<void> => {
        const queryWithPagination: ParsedUrlQueryInput = R.pickBy(
            (val: string, key: string): boolean => (!!val && key === 'page') || key === 'pageSize',
            query,
        );

        await Router.push({ pathname, query: queryWithPagination });
        resetForm();
        handleCloseDrawer();
    };

    const renderDesktopClearFiltersButton = !isMobile ? (
        <FormControl fullWidth>
            <Button onClick={handleClearFilters} variant="outlined" color="primary" endIcon={<Clear />} fullWidth>
                {t('common:clear')}
            </Button>
        </FormControl>
    ) : (
        undefined
    );

    return {
        submitButtonText,
        handleSubmit,
        renderDesktopClearFiltersButton,
        handleClearFilters,
        resetForm,
        setSubmitting,
        drawerProps,
        ...other,
    };
};
