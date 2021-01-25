import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { Emoji, ListTemplate } from 'components';
import { withUserMe } from 'hocs';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { SeoPageProps } from 'types';
import { ABOUT_ITEMS } from 'utils';

export const AboutPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const { t } = useTranslation();

  const renderAboutMenuItems = ABOUT_ITEMS.map(({ emoji, href, text }, i) => (
    <Link href={href} key={i}>
      <MenuItem>
        <ListItemIcon>
          <Emoji emoji={emoji} noSpace />
        </ListItemIcon>
        <ListItemText>{t(text)}</ListItemText>
      </MenuItem>
    </Link>
  ));

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('about:header'),
      emoji: 'ℹ️',
    },
  };

  return (
    <ListTemplate {...layoutProps}>
      <List>{renderAboutMenuItems}</List>
    </ListTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'about');

  return {
    props: {
      _ns: await loadNamespaces(['about'], locale),
      seoProps: {
        title: t('title'),
      },
    },
  };
};

export default withUserMe(AboutPage);
