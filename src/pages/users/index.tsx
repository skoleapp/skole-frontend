import { Avatar, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import Link from 'next/link';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import { UsersDocument } from '../../../generated/graphql';
import { Layout, StyledTable } from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext, User } from '../../types';
import { useAuthSync } from '../../utils';

interface Props extends I18nProps {
    users?: User[];
}

const UsersPage: I18nPage<Props> = ({ users }) => {
    const { t } = useTranslation();

    return (
        <Layout heading={t('users:title')} title={t('users:title')} backUrl>
            <StyledTable>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="h6">{t('common:users')}</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="h6">{t('common:points')}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users && users.length ? (
                            users.map((u: User, i: number) => (
                                <Link href={`/users/${u.id}`} key={i}>
                                    <TableRow>
                                        <TableCell className="user-cell">
                                            <Avatar src={process.env.BACKEND_URL + u.avatarThumbnail} />
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
                                    <Typography variant="subtitle1">{t('users:noUsersFound')}</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </StyledTable>
        </Layout>
    );
};

UsersPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    await useAuthSync(ctx);

    try {
        const { data } = await ctx.apolloClient.query({ query: UsersDocument });
        return { ...data, namespacesRequired: includeDefaultNamespaces(['users']) };
    } catch {
        return { namespacesRequired: includeDefaultNamespaces(['users']) };
    }
};

export default compose(withApollo, withRedux)(UsersPage);
