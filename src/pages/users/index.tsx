import * as R from 'ramda';

import { Avatar, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { FormSubmitSection, MainLayout, SelectField, StyledForm } from '../../components';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { UserType, UsersDocument } from '../../../generated/graphql';
import { getAvatarThumb, useAuthSync, useSearchLayout } from '../../utils';
import { withApollo, withRedux } from '../../lib';

import Link from 'next/link';
import React from 'react';
import { TextField } from 'formik-material-ui';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../../i18n';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

interface FilterUsersFormValues {
    username: string;
    ordering: string;
}

interface Props extends I18nProps {
    users?: UserType[];
}

const UsersPage: I18nPage<Props> = ({ users }) => {
    const { t } = useTranslation();
    const { query } = useRouter();

    const {
        handleSubmit,
        submitButtonText,
        renderClearFiltersButton,
        renderMobileContent,
        renderDesktopContent,
        ref,
    } = useSearchLayout<FilterUsersFormValues>();

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
            <TableHead>
                <TableRow>
                    <TableCell>
                        <Typography variant="subtitle2" color="textSecondary">
                            {t('common:username')}
                        </Typography>
                    </TableCell>
                    <TableCell align="right">
                        <Typography variant="subtitle2" color="textSecondary">
                            {t('common:points')}
                        </Typography>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {users && users.length ? (
                    users.map((u: UserType, i: number) => (
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
                    ))
                ) : (
                    <TableRow>
                        <TableCell className="user-cell">
                            <Typography variant="subtitle1">{t('users:notFound')}</Typography>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

    const responsiveContentProps = {
        renderTableContent,
        renderCardContent,
    };

    return (
        <MainLayout heading={t('users:title')} title={t('users:title')} backUrl>
            {renderMobileContent(responsiveContentProps)}
            {renderDesktopContent(responsiveContentProps)}
        </MainLayout>
    );
};

UsersPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    await useAuthSync(ctx);
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['users']) };

    try {
        const { data } = await ctx.apolloClient.query({ query: UsersDocument });
        return { ...data, ...nameSpaces };
    } catch {
        return nameSpaces;
    }
};

export default compose(withApollo, withRedux)(UsersPage);
