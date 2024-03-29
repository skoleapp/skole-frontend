import { makeStyles } from '@material-ui/core/styles';
import Image from 'next/image';
import React from 'react';
import { urls } from 'utils';

import { Link } from './Link';

const useStyles = makeStyles({
  root: {
    cursor: 'pointer',
  },
});

export const Logo: React.FC = () => {
  const classes = useStyles();

  return (
    <Link href={urls.home}>
      <Image
        height={30}
        width={80}
        className={classes.root}
        src="/images/icons/skole-icon-text.svg"
      />
    </Link>
  );
};
