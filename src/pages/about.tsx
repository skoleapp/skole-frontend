import { I18nPage, I18nProps, SkoleContext } from '../types';
import { withApollo, withRedux } from '../lib';

import React from 'react';
import { SettingsLayout } from '../components';
import { Typography } from '@material-ui/core';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../i18n';
import { useAuthSync } from '../utils';
import { useTranslation } from 'react-i18next';

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
