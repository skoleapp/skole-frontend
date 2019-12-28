import { Divider } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { compose } from 'redux';
import {
  ButtonLink,
  Layout,
  NotFound,
  SlimCardContent,
  StyledCard,
  UserProfileCardContent
} from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext, State } from '../../types';
import { usePrivatePage } from '../../utils';

const ProfilePage: I18nPage = () => {
  const { user } = useSelector((state: State) => state.auth);
  const { t } = useTranslation();

  if (user) {
    return (
      <Layout heading={t('profile:heading')} title={t('profile:title')} backUrl>
        <StyledCard>
          <UserProfileCardContent user={user} />
          <Divider />
          <SlimCardContent>
            <ButtonLink href="/profile/edit" color="primary" variant="outlined" fullWidth>
              {t('profile:editProfileButton')}
            </ButtonLink>
          </SlimCardContent>
        </StyledCard>
      </Layout>
    );
  } else {
    return <NotFound title={t('profile:notFound')} />;
  }
};

ProfilePage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await usePrivatePage(ctx);

  return {
    namespacesRequired: includeDefaultNamespaces(['profile'])
  };
};

export default compose(withApollo, withRedux)(ProfilePage);
