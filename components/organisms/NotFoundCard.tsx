import React from 'react';
import { Card, H1 } from '../atoms';

interface Props {
  text?: string;
}

export const NotFoundCard: React.FC<Props> = ({ text }) => (
  <Card>{text ? <H1>{text}</H1> : <H1>The page you were looking for was not found...</H1>}</Card>
);
