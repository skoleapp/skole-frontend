import React from 'react';
import Image from 'next/image';

interface Props {
  lang: string;
}

export const LanguageFlag: React.FC<Props> = ({ lang }) => (
  <Image src={`/images/language-flags/${lang}.svg`} width={20} height={20} />
);
