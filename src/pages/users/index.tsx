import {
    Avatar,
    CardContent,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import { Field, Form, Formik, FormikActions } from 'formik';
import { TextField } from 'formik-material-ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';

import { UserObjectType, UsersDocument } from '../../../generated/graphql';
import { FilterLayout, FormSubmitSection, SelectField } from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { useFilters, usePrivatePage } from '../../utils';
import { mediaURL } from '../../utils/mediaURL';

interface FilterUsersFormValues {
    username: string;
    ordering: string;
}

interface Props extends I18nProps {
    users?: UserObjectType[];
}

const UsersPage: I18nPage<Props> = ({ users }) => {
    const { toggleDrawer, open, handleSubmit, submitButtonText, renderClearFiltersButton, ref } = useFilters<
        FilterUsersFormValues
    >();

    const { t } = useTranslation();
    const { query } = useRouter();

    const handlePreSubmit = <T extends FilterUsersFormValues>(values: T, actions: FormikActions<T>): void => {
        const { username, ordering } = values;
        handleSubmit({ username, ordering }, actions);
    };

    // Pre-load query params to the form.
    const initialValues = {
        username: R.propOr('', 'username', query) as string,
        ordering: R.propOr('', 'ordering', query) as string,
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
                        <MenuItem value="points">{t('forms:pointsOrdering')}</MenuItem>
                        <MenuItem value="-points">{t('forms:pointsOrderingReverse')}</MenuItem>
                    </Field>
                    <FormSubmitSection submitButtonText={submitButtonText} {...props} />
                    {renderClearFiltersButton}
                </Form>
            )}
        </Formik>
    );

    const renderTableContent =
        users && users.length ? (
            <Table>
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
                                    <Avatar src={mediaURL(R.propOr('', 'avatarThumbnail', u))} />
                                    <Typography variant="subtitle1">{R.propOr('-', 'username', u)}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="subtitle1">{R.propOr('-', 'points', u)}</Typography>
                                </TableCell>
                            </TableRow>
                        </Link>
                    ))}
                </TableBody>
            </Table>
        ) : (
            <CardContent>
                <Typography variant="subtitle1">{t('users:notFound')}</Typography>
            </CardContent>
        );

    return (
        <FilterLayout<FilterUsersFormValues>
            heading={t('users:title')}
            title={t('users:title')}
            renderCardContent={renderCardContent}
            renderTableContent={renderTableContent}
            toggleDrawer={toggleDrawer}
            open={open}
            backUrl
        />
    );
};

UsersPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    await usePrivatePage(ctx);
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
