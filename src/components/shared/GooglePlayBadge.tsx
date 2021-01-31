import Typography from '@material-ui/core/Typography';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

export const GooglePlayBadge: React.FC = () => {
  const { pathname } = useRouter();
  const handleClick = () => sa_event(`click_link_to_google_play_from_${pathname}`);

  return (
    <Typography
      onClick={handleClick}
      component="a"
      href="https://play.google.com/store/apps/details?id=com.skole"
      target="_blank"
    >
      <Image
        layout="responsive"
        height={60}
        width={180}
        src="/images/app-store-badges/google-play-badge.svg"
      />
    </Typography>
  );
};
