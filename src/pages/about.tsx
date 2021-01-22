import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { BackButton, Emoji, MainTemplate } from 'components';
import { withUserMe } from 'hocs';
import { useMediaQueries } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { SeoPageProps } from 'types';
import { ABOUT_ITEMS } from 'utils';

const useStyles = makeStyles(({ breakpoints, spacing, palette }) => ({
  paper: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  cardHeaderRoot: {
    borderBottom: BORDER,
    position: 'relative',
    padding: spacing(3),
  },
  cardHeaderTitle: {
    color: palette.text.secondary,
  },
  cardHeaderAvatar: {
    position: 'absolute',
    top: spacing(2),
    left: spacing(2),
  },
}));

export const AboutPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();

  const header = (
    <>
      {t('about:header')}
      <Emoji emoji="ℹ️" />
    </>
  );

  const renderBackButton = <BackButton />;

  const renderCardHeader = isTabletOrDesktop && (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        title: classes.cardHeaderTitle,
        avatar: classes.cardHeaderAvatar,
      }}
      title={header}
      avatar={renderBackButton}
    />
  );

  const renderAboutMenuItems = ABOUT_ITEMS.map(({ emoji, href, text }, i) => (
    <Link href={href} key={i}>
      <MenuItem>
        <ListItemIcon>
          <Emoji emoji={emoji} />
        </ListItemIcon>
        <ListItemText>{t(text)}</ListItemText>
      </MenuItem>
    </Link>
  ));

  const renderAboutMenuList = <List>{renderAboutMenuItems}</List>;

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header,
      renderBackButton,
    },
  };

  return (
    <MainTemplate {...layoutProps}>
      <Paper className={classes.paper}>
        {renderCardHeader}
        {renderAboutMenuList}
      </Paper>
    </MainTemplate>
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
