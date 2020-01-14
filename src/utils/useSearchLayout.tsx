import * as R from 'ramda';

import {
    Box,
    Button,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
    IconButton,
    SwipeableDrawer,
} from '@material-ui/core';
import { Cancel, Clear, FilterList } from '@material-ui/icons';
import { StyledCard, StyledTable } from '../components';
import { UseForm, useForm } from './useForm';

import { ParsedUrlQueryInput } from 'querystring';
import React from 'react';
import { Router } from '../i18n';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ResponsiveContentProps {
    renderTableContent: JSX.Element;
    renderForm: JSX.Element;
}

interface UseSearchLayout<T> extends UseForm<T> {
    submitButtonText: string;
    handleSubmit: (filteredValues: T) => Promise<void>;
    renderClearFiltersButton: JSX.Element;
    renderMobileContent: (props: ResponsiveContentProps) => JSX.Element;
    renderDesktopContent: (props: ResponsiveContentProps) => JSX.Element;
    handleClearFilters: () => Promise<void>;
}

export const useSearchLayout = <T extends {}>(): UseSearchLayout<T> => {
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

    const renderExitDrawerButton = (
        <IconButton onClick={toggleDrawer(false)}>
            <Cancel />
        </IconButton>
    );

    const renderClearFiltersButton = (
        <FormControl fullWidth>
            <Button onClick={handleClearFilters} variant="outlined" color="primary" endIcon={<Clear />} fullWidth>
                {t('common:clear')}
            </Button>
        </FormControl>
    );

    const renderMobileContent = ({ renderTableContent, renderForm }: ResponsiveContentProps): JSX.Element => (
        <Box className="md-down">
            <Box marginBottom="0.5rem">
                <StyledCard>
                    <CardContent>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={toggleDrawer(true)}
                            endIcon={<FilterList />}
                            fullWidth
                        >
                            {t('common:advancedSearch')}
                        </Button>
                    </CardContent>
                </StyledCard>
            </Box>
            <StyledTable>{renderTableContent}</StyledTable>
            <SwipeableDrawer anchor="bottom" open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
                <StyledCard scrollable>
                    <CardHeader subheader={t('common:advancedSearch')} action={renderExitDrawerButton} />
                    <CardContent>{renderForm}</CardContent>
                </StyledCard>
            </SwipeableDrawer>
        </Box>
    );

    const renderDesktopContent = ({ renderForm, renderTableContent }: ResponsiveContentProps): JSX.Element => (
        <StyledCard className="md-up">
            <Grid container>
                <Grid item xs={5} md={4} lg={3}>
                    <CardHeader subheader={t('common:advancedSearch')} />
                    <CardContent>{renderForm}</CardContent>
                </Grid>
                <Grid item xs={7} md={8} lg={9}>
                    <CardHeader subheader={t('common:searchResults')} />
                    <CardContent>
                        <StyledTable disableBoxShadow>{renderTableContent}</StyledTable>
                    </CardContent>
                </Grid>
            </Grid>
        </StyledCard>
    );

    return {
        submitButtonText,
        handleSubmit,
        renderClearFiltersButton,
        renderMobileContent,
        renderDesktopContent,
        handleClearFilters,
        resetForm,
        setSubmitting,
        ...other,
    };
};
