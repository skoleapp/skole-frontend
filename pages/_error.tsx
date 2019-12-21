import { CardHeader } from '@material-ui/core';
import { Layout, StyledCard } from '../components';
import { includeDefaultNamespaces, useTranslation } from '../i18n';
import { I18nPage } from '../interfaces';

const ErrorPage: I18nPage = () => {
  const { t } = useTranslation();

  return (
    <Layout title={t('somethingWentWrong')}>
      <StyledCard>
        <CardHeader title={t('somethingWentWrong')} />
      </StyledCard>
    </Layout>
  );
};

ErrorPage.getInitialProps = () => {
  return {
    namespacesRequired: includeDefaultNamespaces([])
  };
};

export default ErrorPage;
