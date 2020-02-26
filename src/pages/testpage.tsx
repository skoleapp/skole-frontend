import React from 'react';
import { compose } from 'redux';

import { ResourcePreview, FullWidthLayout } from '../components';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync } from '../utils';

const Testpage: I18nPage = () => {
    const renderCardContent = <ResourcePreview />;

    return <FullWidthLayout renderCardContent={renderCardContent} backUrl />;
};

Testpage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['terms']) };
};

export default compose(withApollo, withRedux)(Testpage);
