import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { Link, ListTemplate } from 'components';
import { withAuthRequired } from 'hocs';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React, { useMemo } from 'react';
import { ABOUT_ITEMS } from 'utils';

export const AboutPage: NextPage = () => {
  const { t } = useTranslation();

  const renderAboutMenuItems = useMemo(
    () =>
      ABOUT_ITEMS.map(({ icon: Icon, href, text }, i) => (
        <Link href={href} key={i} fullWidth>
          <MenuItem>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText>{t(text)}</ListItemText>
          </MenuItem>
        </Link>
      )),
    [t],
  );

  const layoutProps = {
    seoProps: {
      title: t('about:title'),
    },
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

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['about'], locale),
  },
});

export default withAuthRequired(AboutPage);
