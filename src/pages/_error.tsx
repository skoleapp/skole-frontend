import { compose } from 'redux';
import { NotFound } from '../components';
import { includeDefaultNamespaces, useTranslation } from '../i18n';
import { I18nPage, I18nProps, SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync } from '../utils';

const ErrorPage: I18nPage = () => {
  const { t } = useTranslation();

  return <NotFound title={t('_error:notFound')} />;
};

ErrorPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await useAuthSync(ctx);

  return {
    namespacesRequired: includeDefaultNamespaces([])
  };
};

export default compose(withApollo, withRedux)(ErrorPage);
