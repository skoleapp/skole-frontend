import { Box, Grid, Typography } from '@material-ui/core';
import {
  CloudUploadOutlined,
  HouseOutlined,
  LibraryAddOutlined,
  SchoolOutlined,
  ScoreOutlined,
  SubjectOutlined
} from '@material-ui/icons';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { ButtonLink, Layout, Shortcut } from '../components';
import { SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync } from '../utils';
import { withTranslation } from '../i18n';

const IndexPage: NextPage = ({ t }: any) => (
  <Layout t={t} title={t('headerHome')}>
    <Box marginY="1rem">
      <Typography variant="h5">{t('Learn with Skole community!')}</Typography>
    </Box>
    <Grid container>
      <Grid item xs={12}>
        <Box className="flex-flow" display="flex" justifyContent="center">
          <Shortcut text={t('Courses')} icon={SchoolOutlined} href="/courses" />
          <Shortcut text={t('Schools')} icon={HouseOutlined} href="/schools" />
          <Shortcut text={t('Subjects')} icon={SubjectOutlined} href="/subjects" />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box className="flex-flow" display="flex" justifyContent="center">
          <Shortcut
            text={t('Upload Resource')}
            icon={CloudUploadOutlined}
            href="/upload-resource"
          />
          <Shortcut text={t('Create Course')} icon={LibraryAddOutlined} href="/create-course" />
          <Shortcut text={t('Leaderboard')} icon={ScoreOutlined} href="/leaderboard" />
        </Box>
      </Grid>
    </Grid>
    <Box marginY="1rem">
      <Typography variant="h6" gutterBottom>
        {t('Is your school or subject not listed?')}
      </Typography>
      <ButtonLink href="/contact" variant="outlined" color="primary">
        {t('contactUs')}
      </ButtonLink>
    </Box>
  </Layout>
);

IndexPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return { namespacesRequired: ['common'] };
};

export default compose(withRedux, withApollo, withTranslation('common'))(IndexPage);
