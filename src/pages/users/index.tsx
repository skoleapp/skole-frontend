import * as R from 'ramda';

import { Avatar, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { Layout, StyledTable } from '../../components';
import { UserType, UsersDocument } from '../../../generated/graphql';
import { getAvatarThumb, useAuthSync } from '../../utils';
import { withApollo, withRedux } from '../../lib';

import Link from 'next/link';
import React from 'react';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../../i18n';
import { useTranslation } from 'react-i18next';

interface Props extends I18nProps {
    users?: UserType[];
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
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['users']) };

    try {
        const { data } = await ctx.apolloClient.query({ query: UsersDocument });
        return { ...data, ...nameSpaces };
    } catch {
        return nameSpaces;
    }
};

export default compose(withApollo, withRedux)(UsersPage);
