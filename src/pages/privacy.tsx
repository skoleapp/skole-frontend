import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { I18nProps } from 'src/types';

import { SettingsLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';

const PrivacyPage: NextPage<I18nProps> = () => {
    const { t } = useTranslation();

    const layoutProps = {
        seoProps: {
            title: t('privacy:title'),
            description: t('privacy:description'),
        },
        topNavbarProps: {
            header: t('privacy:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('privacy:header'),
        infoContent: t('privacy:content'),
        infoLayout: true,
    };

    return <SettingsLayout {...layoutProps} />;
};

export const getServerSideProps: GetServerSideProps = async () => ({
    props: { namespacesRequired: includeDefaultNamespaces(['privacy']) },
});

export default PrivacyPage;
