import { NotFoundLayout } from 'components';
import { withDynamicNamespaces } from 'lib';
import React from 'react';

const NotFoundPage = (): JSX.Element => <NotFoundLayout />;
export default withDynamicNamespaces(NotFoundPage);
