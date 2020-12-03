import React from 'react';
import Image from 'next/image';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {},
});

interface Props {
  lang: string;
}

export const LanguageFlag: React.FC<Props> = ({ lang }) => {
  const classes = useStyles();

  return (
    <Image src={`/language-flags/${lang}.svg`} width={20} height={20} className={classes.root} />
  );
};
