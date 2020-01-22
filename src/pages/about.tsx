import { Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';

import { SettingsLayout } from '../components';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync } from '../utils';

const AboutPage: I18nPage = () => {
    const { t } = useTranslation();
    const renderCardContent = <Typography>Here will be about content...</Typography>;
    return <SettingsLayout title={t('about:title')} renderCardContent={renderCardContent} backUrl />;
};

AboutPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['about']) };
};

export default compose(withApollo, withRedux)(AboutPage);
