import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { BackButton, LoginRequiredTemplate, MainTemplate } from 'components';
import { useAuthContext } from 'context';
import { withUserMe } from 'hocs';
import { useMediaQueries } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { ABOUT_ITEMS } from 'utils';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
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
  cardHeaderAvatar: {
    position: 'absolute',
    top: spacing(2),
    left: spacing(2),
  },
}));

export const AboutPage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();
  const { userMe, profileUrl } = useAuthContext();
  const header = t('about:header');

  const renderBackButton = (
    <BackButton
      href={!!userMe && profileUrl}
      tooltip={!!userMe && t('common-tooltips:backToProfile')}
    />
  );

  const renderCardHeader = isTabletOrDesktop && (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        avatar: classes.cardHeaderAvatar,
      }}
      title={header}
      avatar={renderBackButton}
    />
  );

  const renderAboutMenuItems = ABOUT_ITEMS.map(({ icon: Icon, href, text }, i) => (
    <Link href={href} key={i}>
      <MenuItem>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText>{t(text)}</ListItemText>
      </MenuItem>
    </Link>
  ));

  const renderAboutMenuList = <List>{renderAboutMenuItems}</List>;

  const layoutProps = {
    seoProps: {
      title: t('about:title'),
    },
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

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['about'], locale),
  },
});

export default withUserMe(AboutPage);
