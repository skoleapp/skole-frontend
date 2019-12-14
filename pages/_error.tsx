import React from 'react';
import { withTranslation } from '../i18n';
import { NextPage } from 'next';

interface ErrorProps {
  statusCode: number | null | undefined;
  namespacesRequired: string[];
  t?: any;
}

const ErrorPage: NextPage<ErrorProps> = ({ statusCode, t }) => {
  return <p>{statusCode ? t('error-with-status', { statusCode }) : t('error-without-status')}</p>;
};

ErrorPage.getInitialProps = async ({
  res,
  err
}): Promise<{
  namespacesRequired: string[];
  statusCode: number | null | undefined;
  t?: any;
}> => {
  let statusCode = null;
  if (res) {
    ({ statusCode } = res);
  } else if (err) {
    ({ statusCode } = err);
  }
  return {
    namespacesRequired: ['common'],
    statusCode
  };
};

const WithTranslation: any = withTranslation('common');

export default WithTranslation(ErrorPage);
