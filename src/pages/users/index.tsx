import { Avatar, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';

import { UserObjectType, UsersDocument } from '../../../generated/graphql';
import { FilterLayout, FormSubmitSection, SelectField, StyledForm } from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { getAvatarThumb, useAuthSync, useFilters } from '../../utils';

interface FilterUsersFormValues {
    username: string;
    ordering: string;
}

interface Props extends I18nProps {
    users?: UserObjectType[];
}

const UsersPage: I18nPage<Props> = ({ users }) => {
    const filterProps = useFilters<FilterUsersFormValues>();
    const { handleSubmit, submitButtonText, renderClearFiltersButton, ref } = filterProps;
    const { t } = useTranslation();
    const { query } = useRouter();

    const handlePreSubmit = (values: FilterUsersFormValues): void => {
        const { username, ordering } = values;
        handleSubmit({ username, ordering });
    };

    // Pre-load query params to the form.
    const initialValues = {
        username: R.propOr('', 'username', query) as string,
        ordering: R.propOr('', 'ordering', query) as string,
    };

    const renderCardContent = (
        <Formik onSubmit={handlePreSubmit} initialValues={initialValues} ref={ref}>
            {(props): JSX.Element => (
                <StyledForm>
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
                        <MenuItem value="points">{t('forms:pointsOrdering')}</MenuItem>
                        <MenuItem value="-points">{t('forms:pointsOrderingReverse')}</MenuItem>
                    </Field>
                    <FormSubmitSection submitButtonText={submitButtonText} {...props} />
                    {renderClearFiltersButton}
                </StyledForm>
            )}
        </Formik>
    );

    const renderTableContent = (
        <Table>
            {users && users.length ? (
                <>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {t('common:username')}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="subtitle1" color="textSecondary">
                                    {t('common:points')}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u: UserObjectType, i: number) => (
                            <Link href={`/users/${u.id}`} key={i}>
                                <TableRow>
                                    <TableCell className="user-cell">
                                        <Avatar src={getAvatarThumb(u)} />
                                        <Typography variant="subtitle1">{R.propOr('-', 'username', u)}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="subtitle1">{R.propOr('-', 'points', u)}</Typography>
                                    </TableCell>
                                </TableRow>
                            </Link>
                        ))}
                    </TableBody>
                </>
            ) : (
                <Typography variant="subtitle1">{t('users:notFound')}</Typography>
            )}
        </Table>
    );

    return (
        <FilterLayout<FilterUsersFormValues>
            heading={t('users:title')}
            title={t('users:title')}
            renderCardContent={renderCardContent}
            renderTableContent={renderTableContent}
            backUrl
            {...filterProps}
        />
    );
};

UsersPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    await useAuthSync(ctx);
    const { query, apolloClient } = ctx;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['users']) };

    try {
        const { data } = await apolloClient.query({ query: UsersDocument, variables: query });
        return { ...data, ...nameSpaces };
    } catch {
        return nameSpaces;
    }
};

export default compose(withApollo, withRedux)(UsersPage);
