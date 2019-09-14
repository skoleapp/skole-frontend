import Router from 'next/router';
import React from 'react';
import { LoadingScreen } from '../layout';

interface Props {
  to: string;
  loadingText: string;
}

export const Redirect: React.FC<Props> = ({ to, loadingText }) =>
  Router.push(`/${to}`) && <LoadingScreen loadingText={loadingText} />;
