import { Button } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import { Text } from '../atoms';

export const ThanksForFeedback: React.FC = () => (
  <>
    <Text>Thank you for your feedback!</Text>
    <Link href="/">
      <Button variant="contained" color="primary">
        back to home
      </Button>
    </Link>
  </>
);
