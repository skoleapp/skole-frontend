import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import { UserDocument } from '../../../generated/graphql';
import { Layout, NotFound, StyledCard, UserProfileCardContent } from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext, User } from '../../types';
import { redirect, useAuthSync } from '../../utils';

interface Props extends I18nProps {
  user?: User;
}

const UserPage: I18nPage<Props> = ({ user }) => {
  const { t } = useTranslation();

  if (user) {
    const username = user.username || '-';

    return (
      <Layout heading={username} title={username} backUrl>
        <StyledCard>
          <UserProfileCardContent user={user} />
        </StyledCard>
      </Layout>
    );
  } else {
    return <NotFound title={t('profile:notFound')} />;
  }
};

UserPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  const { query, apolloClient } = ctx;
  const { userMe } = await useAuthSync(ctx);
  const { userId } = query;

  // Redirect to own profile if id matches signed in user.
  if (userMe && userMe.id === userId) {
    redirect(ctx, '/profile');
    return { namespacesRequired: includeDefaultNamespaces(['profile']) };
  }

  try {
    const { data } = await apolloClient.query({
      query: UserDocument,
      variables: { userId }
    });

    return { ...data, namespacesRequired: includeDefaultNamespaces(['profile']) };
  } catch {
    return { namespacesRequired: includeDefaultNamespaces(['profile']) };
  }
};

export default compose(withRedux, withApollo)(UserPage);
