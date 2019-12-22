import {
  Avatar,
  Box,
  CardHeader,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@material-ui/core';
import { SchoolOutlined, SubjectOutlined } from '@material-ui/icons';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { SchoolDetailDocument } from '../../../generated/graphql';
import {
  ButtonLink,
  Layout,
  NotFound,
  SlimCardContent,
  StyledCard,
  StyledList,
  TextLink
} from '../../components';
import { School, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useAuthSync } from '../../utils';

interface Props {
  school?: School;
}

const SchoolDetailPage: NextPage<Props> = ({ school }) => {
  if (school) {
    const schoolName = school.name || 'School Name N/A';
    const schoolType = school.schoolType || 'N/A';
    const country = school.country || 'Country N/A';
    const city = school.city || 'City N/A';
    const courseCount = school.courseCount || 'N/A';
    const subjectCount = school.subjectCount || 'N/A';

    const renderGeneralSchoolInfo = (
      <SlimCardContent>
        <Box textAlign="left">
          <Typography variant="body1">
            School Type:{' '}
            <TextLink
              href={{ pathname: '/search', query: { schoolType: school.schoolType || '' } }}
              color="primary"
            >
              {schoolType}
            </TextLink>
          </Typography>
          <Typography variant="body1">
            Country:{' '}
            <TextLink
              href={{ pathname: '/search', query: { countryName: school.country || '' } }}
              color="primary"
            >
              {country}
            </TextLink>
          </Typography>
          <Typography variant="body1">
            City:{' '}
            <TextLink
              href={{ pathname: '/search', query: { cityName: school.city || '' } }}
              color="primary"
            >
              {city}
            </TextLink>
          </Typography>
        </Box>
      </SlimCardContent>
    );

    const renderSchoolInfoList = (
      <SlimCardContent>
        <StyledList>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <SchoolOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>Courses: {courseCount}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <SubjectOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>Subjects: {subjectCount}</ListItemText>
          </ListItem>
        </StyledList>
      </SlimCardContent>
    );

    return (
      <Layout heading={schoolName} title={schoolName} backUrl>
        <StyledCard>
          <CardHeader title={schoolName} />
          <Divider />
          <Box
            className="flex-flow"
            display="flex"
            justifyContent="space-around"
            alignItems="center"
          >
            {renderGeneralSchoolInfo}
            {renderSchoolInfoList}
          </Box>
          <Divider />
          <SlimCardContent>
            <ButtonLink
              href={{ pathname: '/search', query: { schoolName: school.name || '' } }}
              variant="outlined"
              color="primary"
              fullWidth
            >
              courses
            </ButtonLink>
          </SlimCardContent>
        </StyledCard>
      </Layout>
    );
  } else {
    return <NotFound title="Course not found..." />;
  }
};

SchoolDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useAuthSync(ctx);
  const { apolloClient, query } = ctx;

  try {
    const { schoolId } = query;
    const { data } = await apolloClient.query({
      query: SchoolDetailDocument,
      variables: { schoolId }
    });

    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withApollo, withRedux)(SchoolDetailPage);
