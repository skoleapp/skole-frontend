import React from 'react';
import { H3 } from '../atoms';

interface Props {
  error: string;
}

export const ErrorPage: React.FC<Props> = ({ error }) => <H3>{error}</H3>;
