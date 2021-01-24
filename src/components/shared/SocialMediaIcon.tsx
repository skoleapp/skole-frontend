import Image from 'next/image';
import React from 'react';

interface Props {
  name: string;
}

export const SocialMediaIcon: React.FC<Props> = ({ name }) => (
  <Image src={`/images/social-media-icons/${name}.svg`} width={20} height={20} />
);
