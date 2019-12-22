import { NotFound } from '../components';
import { includeDefaultNamespaces, useTranslation } from '../i18n';
import { I18nPage } from '../interfaces';

const ErrorPage: I18nPage = () => {
  const { t } = useTranslation();

  return <NotFound title={t('common:notFound')} />;
};

ErrorPage.getInitialProps = () => {
  return {
    namespacesRequired: includeDefaultNamespaces([])
  };
};

export default ErrorPage;
