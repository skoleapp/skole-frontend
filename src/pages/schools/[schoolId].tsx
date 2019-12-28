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
import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, School, SkoleContext } from '../../types';
import { useAuthSync } from '../../utils';

interface Props extends I18nProps {
  school?: School;
}

const SchoolDetailPage: I18nPage<Props> = ({ school }) => {
  const { t } = useTranslation();

  if (school) {
    const schoolName = school.name || '-';
    const schoolType = school.schoolType || '-';
    const country = school.country || '-';
    const city = school.city || '-';
    const courseCount = school.courseCount || '-';
    const subjectCount = school.subjectCount || '-';

    const renderGeneralSchoolInfo = (
      <SlimCardContent>
        <Box textAlign="left">
          <Typography variant="body1">
            {t('common:schoolType')}:{' '}
            <TextLink
              href={{ pathname: '/search', query: { schoolType: school.schoolType || '' } }}
              color="primary"
            >
              {schoolType}
            </TextLink>
          </Typography>
          <Typography variant="body1">
            {t('common:country')}:{' '}
            <TextLink
              href={{ pathname: '/search', query: { countryName: school.country || '' } }}
              color="primary"
            >
              {country}
            </TextLink>
          </Typography>
          <Typography variant="body1">
            {t('common:city')}:{' '}
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
            <ListItemText>
              {t('common:courses')}: {courseCount}
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <SubjectOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              {t('common:subjects')}: {subjectCount}
            </ListItemText>
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
              {t('common:courses')}
            </ButtonLink>
          </SlimCardContent>
        </StyledCard>
      </Layout>
    );
  } else {
    return <NotFound title={t('school:notFound')} />;
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

    return { ...data, namespacesRequired: includeDefaultNamespaces(['school']) };
  } catch {
    return { namespacesRequired: includeDefaultNamespaces(['school']) };
  }
};

export default compose(withApollo, withRedux)(SchoolDetailPage);
