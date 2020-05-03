import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { I18nProps } from 'src/types';

import { SettingsLayout } from '../components';
import { includeDefaultNamespaces } from '../i18n';

const TermsPage: NextPage<I18nProps> = () => {
    const { t } = useTranslation();

    const layoutProps = {
        seoProps: {
            title: t('terms:title'),
            description: t('terms:description'),
        },
        topNavbarProps: {
            header: t('terms:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('terms:header'),
        infoContent: t('terms:content'),
        infoLayout: true,
    };

    return <SettingsLayout {...layoutProps} />;
};

export const getServerSideProps: GetServerSideProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['terms']),
    },
});

export default TermsPage;
