import { Avatar, Box, MenuItem, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { Field, Form, Formik, FormikActions } from 'formik';
import { TextField } from 'formik-material-ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';

import { PaginatedUserObjectType, UserObjectType, UsersDocument } from '../../../generated/graphql';
import { FilterLayout, FormSubmitSection, NotFoundBox, PaginatedTable, SelectField } from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { getPaginationQuery, mediaURL, useFilters, withAuthSync } from '../../utils';

interface FilterUsersFormValues {
    username: string;
    ordering: string;
}

interface Props extends I18nProps {
    users?: PaginatedUserObjectType;
}

const UsersPage: I18nPage<Props> = ({ users }) => {
    const { t } = useTranslation();
    const { query } = useRouter();
    const userObjects = R.propOr([], 'objects', users) as UserObjectType[];
    const count = R.propOr(0, 'count', users) as number;

    const {
        handleSubmit,
        submitButtonText,
        renderDesktopClearFiltersButton,
        ref,
        drawerProps,
        handleClearFilters,
    } = useFilters<FilterUsersFormValues>();

    // Pre-load query params to the form.
    const initialValues = {
        username: R.propOr('', 'username', query) as string,
        ordering: R.propOr('', 'ordering', query) as string,
    };

    const handlePreSubmit = <T extends FilterUsersFormValues>(values: T, actions: FormikActions<T>): void => {
        const { username, ordering } = values;
        const paginationQuery = getPaginationQuery({ query, extraFilters: initialValues });

        const filteredValues = {
            ...paginationQuery, // Define this first to override the values.
            username,
            ordering,
        };

        handleSubmit(filteredValues, actions);
    };

    const renderCardContent = (
        <Formik onSubmit={handlePreSubmit} initialValues={initialValues} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    <Field
                        name="username"
                        label={t('forms:username')}
                        placeholder={t('forms:username')}
                        variant="outlined"
                        component={TextField}
                        fullWidth
                    />
                    <Field name="ordering" label={t('forms:ordering')} component={SelectField} fullWidth>
                        <MenuItem value="username">{t('forms:usernameOrdering')}</MenuItem>
                        <MenuItem value="-username">{t('forms:usernameOrderingReverse')}</MenuItem>
                        <MenuItem value="score">{t('forms:scoreOrdering')}</MenuItem>
                        <MenuItem value="-score">{t('forms:scoreOrderingReverse')}</MenuItem>
                    </Field>
                    <FormSubmitSection submitButtonText={submitButtonText} {...props} />
                    {renderDesktopClearFiltersButton}
                </Form>
            )}
        </Formik>
    );

    const renderTableBody = (
        <TableBody>
            {userObjects.map((u: UserObjectType, i: number) => (
                <Link href="/users/[id]" as={`/users/${u.id}`} key={i}>
                    <TableRow>
                        <TableCell>
                            <Box display="flex" alignItems="center">
                                <Avatar src={mediaURL(R.propOr('', 'avatarThumbnail', u))} />
                                <Box marginLeft="1rem">
                                    <Typography variant="subtitle1">{R.propOr('-', 'username', u)}</Typography>
                                </Box>
                            </Box>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant="subtitle1">{R.propOr('-', 'score', u)}</Typography>
                        </TableCell>
                    </TableRow>
                </Link>
            ))}
        </TableBody>
    );

    const tableHeadProps = {
        titleLeft: t('common:username'),
        titleRight: t('common:score'),
    };

    const renderTableContent = !!userObjects.length ? (
        <PaginatedTable
            count={count}
            extraFilters={initialValues}
            tableHeadProps={tableHeadProps}
            renderTableBody={renderTableBody}
        />
    ) : (
        <NotFoundBox text={t('users:notFound')} />
    );

    const layoutProps = {
        seoProps: {
            title: t('users:title'),
            description: t('users:description'),
        },
        topNavbarProps: {
            header: t('users:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('users:header'),
        renderCardContent,
        renderTableContent,
        drawerProps,
        handleClearFilters,
    };

    return <FilterLayout {...layoutProps} />;
};

UsersPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    const { query, apolloClient } = ctx;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['users']) };

    try {
        const { data } = await apolloClient.query({ query: UsersDocument, variables: query });
        return { ...data, ...nameSpaces };
    } catch {
        return nameSpaces;
    }
};

export default withApollo(withAuthSync(UsersPage));
