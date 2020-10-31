import { ErrorLayout } from 'components';
import { withDynamicNamespaces } from 'lib';
import React from 'react';

const ErrorPage = (): JSX.Element => <ErrorLayout />;
export default withDynamicNamespaces(ErrorPage);
