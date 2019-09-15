import Router from 'next/router';
import React from 'react';
import { LoadingScreen } from '../layout';

interface Props {
  to: string;
  loadingMessage: string;
}

export const Redirect: React.FC<Props> = ({ to, loadingMessage }) =>
  Router.push(`/${to}`) && <LoadingScreen text={loadingMessage} />;
