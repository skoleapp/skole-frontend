import { Typography } from '@material-ui/core';
import { Book, House, LibraryAddSharp, School, Score } from '@material-ui/icons';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import styled from 'styled-components';
import { Shortcut } from '../components';
import { Layout } from '../containers';
import { SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync } from '../utils';
import { i18n, Link, withTranslation } from '../i18n';

console.log(i18n);

const IndexPage: NextPage = ({ t }) => (
  <Layout title="Home">
    <StyledLandingPageContent>
      <Typography variant="h5">What would you like to do?</Typography>
      <Typography variant="h5">{t('test')}</Typography>
      <div className="shortcuts">
        <button
          type="button"
          onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'fi' : 'en')}
        />
        <Shortcut text="Browse Schools" icon={House} href="/schools" />
        <Shortcut text="Browse Courses" icon={School} href="/courses" />
        <Shortcut text="Browse Subjects" icon={Book} href="/subjects" />
        <Shortcut text="Create Course" icon={LibraryAddSharp} href="/create-course" />
        <Shortcut text="Leaderboard" icon={Score} href="/leaderboard" />
      </div>
    </StyledLandingPageContent>
  </Layout>
);

const StyledLandingPageContent = styled.div`
  h5 {
    margin: 1rem 0;
  }

  .shortcuts {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
  }
`;

IndexPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return { namespacesRequired: ['common'] };
};

export default compose(withRedux, withApollo, withTranslation('common'))(IndexPage);
