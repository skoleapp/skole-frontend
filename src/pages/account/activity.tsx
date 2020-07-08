import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityList } from 'src/components';
import { useAuthContext } from 'src/context';

import { UserObjectType } from '../../../generated/graphql';
import { NotFoundLayout, SettingsLayout } from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withAuthSync, withSSRAuth, withUserAgent } from '../../lib';
import { I18nProps } from '../../types';

interface Props extends I18nProps {
    userMe?: UserObjectType | null;
}

const ActivityPage: NextPage<Props> = () => {
    const { t } = useTranslation();
    const { user } = useAuthContext();

    const layoutProps = {
        seoProps: {
            title: t('activity:title'),
            description: t('activity:description'),
        },
        topNavbarProps: {
            header: t('activity:header'),
            dynamicBackUrl: true,
        },
        renderCardContent: <ActivityList />,
        desktopHeader: t('activity:header'),
        fullSize: true,
    };

    if (!!user) {
        return <SettingsLayout {...layoutProps} />;
    } else {
        return <NotFoundLayout />;
    }
};

const wrappers = R.compose(withUserAgent, withSSRAuth);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['activity']),
    },
}));

export default withAuthSync(ActivityPage);
