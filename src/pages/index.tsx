import { Box, Grid, Typography } from '@material-ui/core';
import {
  CloudUploadOutlined,
  LibraryAddOutlined,
  SchoolOutlined,
  SupervisedUserCircleOutlined
} from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import styled from 'styled-components';
import { ButtonLink, LandingPageSearchWidget, Layout, Shortcut } from '../components';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync } from '../utils';

const IndexPage: I18nPage = () => {
  const { t } = useTranslation();

  return (
    <Layout title={t('index:title')} disableSearch>
      <StyledIndexPage>
        <Box marginY="1rem">
          <Typography variant="h1">{t('index:slogan')}</Typography>
        </Box>
        <Box marginY="2rem">
          <LandingPageSearchWidget />
        </Box>
        <Grid container>
          <Grid item xs={12}>
            <Box className="flex-flow" display="flex" justifyContent="center">
              <Shortcut text={t('index:browseCourses')} icon={SchoolOutlined} href="/search" />
              <Shortcut
                text={t('index:uploadResource')}
                icon={CloudUploadOutlined}
                href="/upload-resource"
              />
              <Shortcut
                text={t('index:createCourse')}
                icon={LibraryAddOutlined}
                href="/create-course"
              />
              <Shortcut text={t('index:users')} icon={SupervisedUserCircleOutlined} href="/users" />
            </Box>
          </Grid>
        </Grid>
        <Box marginY="1rem">
          <Typography variant="h6" gutterBottom>
            {t('index:contactUsText')}
          </Typography>
          <ButtonLink href="/contact" variant="outlined" color="primary">
            {t('index:contactUsButton')}
          </ButtonLink>
        </Box>
      </StyledIndexPage>
    </Layout>
  );
};

const StyledIndexPage = styled(Box)`
  h1 {
    font-size: 2rem;
  }
`;

IndexPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await useAuthSync(ctx);

  return {
    namespacesRequired: includeDefaultNamespaces(['index'])
  };
};

export default compose(withApollo, withRedux)(IndexPage);
