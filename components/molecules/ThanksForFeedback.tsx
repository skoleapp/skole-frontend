import Link from 'next/link';
import React from 'react';
import { Button, Text } from '../atoms';

export const ThanksForFeedback: React.FC = () => (
  <>
    <Text>Thank you for your feedback!</Text>
    <Link href="/">
      <Button>back to home</Button>
    </Link>
  </>
);
