import { DrawerProps } from '@material-ui/core';
import { FormikActions } from 'formik';
import { SyntheticEvent } from 'react';

import { UseForm } from './forms';

export interface UseDrawer extends DrawerProps {
    handleOpen: (e: SyntheticEvent) => void;
    onClose: (e: SyntheticEvent) => void;
    renderHeader: JSX.Element;
}

export interface UseFilters<T> extends UseForm<T> {
    submitButtonText: string;
    renderDesktopClearFiltersButton?: JSX.Element | false;
    handleSubmit: (filteredValues: T, actions: FormikActions<T>) => Promise<void>;
    handleClearFilters: (e: SyntheticEvent) => Promise<void>;
    drawerProps: Omit<UseDrawer, 'renderHeader'>;
}

export interface ShareParams {
    query?: string;
    text?: string;
}
