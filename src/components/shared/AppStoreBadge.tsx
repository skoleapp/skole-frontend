import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Image from 'next/image';
import React from 'react';

const useStyles = makeStyles({
  image: {
    // the Google Play badge has a border in the image so we want to compensate for that.
    // https://stackoverflow.com/q/34941473/9835872
    padding: '0.15rem !important',
  },
});

export const AppStoreBadge: React.FC = () => {
  const classes = useStyles();
  const handleClick = (): void => sa_event('click_link_to_app_store');

  return (
    <Typography
      onClick={handleClick}
      component="a"
      href="https://apps.apple.com/app/skole-for-students/id1547995609"
      target="_blank"
      rel="noreferrer"
    >
      <Image
        className={classes.image}
        layout="responsive"
        height={60}
        width={180}
        src="/images/app-store-badges/apple-app-store-badge.svg"
      />
    </Typography>
  );
};
