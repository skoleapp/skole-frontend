import { Button, FormControl } from '@material-ui/core';
import { ClearAllOutlined } from '@material-ui/icons';
import { FormikActions } from 'formik';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';

import { useTranslation } from '../i18n';
import { Router } from '../i18n';
import { UseFilters } from '../types';
import { useDrawer } from './useDrawer';
import { useForm } from './useForm';

export const useFilters = <T extends {}>(): UseFilters<T> => {
    const { t } = useTranslation();
    const { resetForm, setSubmitting, ...other } = useForm<T>();
    const drawerProps = useDrawer(t('common:advancedSearch'));
    const { onClose: handleCloseDrawer } = drawerProps;
    const { pathname, query } = useRouter();
    const submitButtonText = t('common:apply');

    // Pick non-empty values and reload the page with new query params.
    const handleSubmit = async (filteredValues: {}, actions: FormikActions<T>): Promise<void> => {
        const validQuery: ParsedUrlQueryInput = R.pickBy((val: string): boolean => !!val, filteredValues);
        await Router.push({ pathname, query: validQuery });
        actions.setSubmitting(false);
        handleCloseDrawer((new Event('Fake event!') as unknown) as SyntheticEvent);
    };

    // Clear the query params and reset form.
    const handleClearFilters = async (e: SyntheticEvent): Promise<void> => {
        const queryWithPagination: ParsedUrlQueryInput = R.pickBy(
            (val: string, key: string): boolean => (!!val && key === 'page') || key === 'pageSize',
            query,
        );

        await Router.push({ pathname, query: queryWithPagination });
        resetForm();
        handleCloseDrawer(e);
    };

    const renderDesktopClearFiltersButton = (
        <FormControl className="md-up" fullWidth>
            <Button
                onClick={handleClearFilters}
                variant="outlined"
                color="primary"
                endIcon={<ClearAllOutlined />}
                fullWidth
            >
                {t('common:clear')}
            </Button>
        </FormControl>
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
