import Router from 'next/router';
import React, { useEffect } from 'react';
import { LoadingScreen } from '../layout';

interface Props {
  to: string;
  loadingText?: string;
}

export const Redirect: React.FC<Props> = ({ to, loadingText }) => {
  useEffect(() => {
    Router.push(to);
  }, []);

  return <LoadingScreen loadingText={loadingText} />;
};
