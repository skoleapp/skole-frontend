import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineOutlined from '@material-ui/icons/AddCircleOutlineOutlined';
import {
  CourseTableBody,
  Emoji,
  ErrorTemplate,
  IconButtonLink,
  InfoDialogContent,
  NotFoundBox,
  PaginatedTable,
  ResponsiveDialog,
  ShareButton,
  SubjectTableBody,
  TabTemplate,
  TextLink,
} from 'components';
import { useAuthContext } from 'context';
import { SchoolDocument, SchoolQueryResult } from 'generated';
import { withUserMe } from 'hocs';
import { useActionsDialog, useInfoDialog, useMediaQueries, useSearch } from 'hooks';
import { getT, initApolloClient, loadNamespaces, useTranslation } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { SeoPageProps } from 'types';
import { getLanguageHeaderContext, MAX_REVALIDATION_INTERVAL, urls } from 'utils';

const SchoolDetailPage: NextPage<SeoPageProps & SchoolQueryResult> = ({
  seoProps,
  data,
  error,
}) => {
  const { verified, verificationRequiredTooltip } = useAuthContext();
  const { t } = useTranslation();
  const { isTabletOrDesktop, isMobile } = useMediaQueries();
  const { searchUrl } = useSearch();
  const { query } = useRouter();
  const variables = R.pick(['id', 'page', 'pageSize'], query);
  const school = R.prop('school', data);
  const schoolId = R.propOr('', 'id', school);
  const schoolName = R.propOr('', 'name', school);
  const schoolTypeName = R.pathOr('', ['schoolType', 'name'], school);
  const schoolTypeId = R.pathOr('', ['schoolType', 'id'], school);
  const country = R.pathOr('', ['country', 'name'], school);
  const city = R.pathOr('', ['city', 'name'], school);
  const subjectCount = R.pathOr(0, ['subjects', 'count'], data);
  const courseCount = R.pathOr(0, ['courses', 'count'], data);
  const countryId = R.pathOr('', ['country', 'id'], school);
  const cityId = R.pathOr('', ['city', 'id'], school);
  const subjects = R.pathOr([], ['subjects', 'objects'], data);
  const courses = R.pathOr([], ['courses', 'objects'], data);
  const shareTitle = t('school:shareTitle', { schoolName });
  const shareText = t('school:shareText', { schoolName });
  const shareParams = { shareHeader: t('school:shareHeader'), shareTitle, shareText };
  const addCourseTooltip = verificationRequiredTooltip || t('school-tooltips:addCourse');

  const renderEmoji = <Emoji emoji="🏫" />;

  const renderHeader = (
    <>
      {schoolName}
      {renderEmoji}
    </>
  );

  const {
    infoDialogOpen,
    infoDialogHeaderProps,
    renderInfoButton,
    handleCloseInfoDialog,
  } = useInfoDialog({
    header: renderHeader,
    infoButtonTooltip: t('school-tooltips:info'),
  });

  const addCourseHref = {
    pathname: urls.addCourse,
    query: {
      school: schoolId,
    },
  };

  const {
    actionsDialogOpen,
    actionsDialogHeaderProps,
    handleCloseActionsDialog,
    renderActionsButton,
    renderShareAction,
  } = useActionsDialog({
    share: t('school:share'),
    shareParams,
    actionsButtonTooltip: t('school-tooltips:actions'),
  });

  const schoolTypeLink = {
    ...searchUrl,
    query: { ...searchUrl.query, schoolType: schoolTypeId },
  };

  const countryLink = {
    ...searchUrl,
    query: { ...searchUrl.query, country: countryId },
  };

  const cityLink = {
    ...searchUrl,
    query: { ...searchUrl.query, city: cityId },
  };

  const renderSchoolTypeLink = (
    <TextLink href={schoolTypeLink} color="primary">
      {schoolTypeName}
    </TextLink>
  );

  const renderCountryLink = (
    <TextLink href={countryLink} color="primary">
      {country}
    </TextLink>
  );

  const renderCityLink = (
    <TextLink href={cityLink} color="primary">
      {city}
    </TextLink>
  );

  const infoItems = [
    {
      label: t('common:courses'),
      value: courseCount,
    },
    {
      label: t('common:subjects'),
      value: subjectCount,
    },
    {
      label: t('common:schoolType'),
      value: renderSchoolTypeLink,
    },
    {
      label: t('common:country'),
      value: renderCountryLink,
    },
    {
      label: t('common:city'),
      value: renderCityLink,
    },
  ];

  // On desktop, render a disabled button for non-verified users.
  // On mobile, do not render the button at all for non-verified users.
  const renderAddCourseButton = (isTabletOrDesktop || (isMobile && !!verified)) && (
    <Tooltip title={addCourseTooltip}>
      <Typography component="span">
        <IconButtonLink
          href={addCourseHref}
          icon={AddCircleOutlineOutlined}
          disabled={verified === false}
          color={isMobile ? 'secondary' : 'default'}
          size="small"
        />
      </Typography>
    </Tooltip>
  );

  const renderShareButton = <ShareButton {...shareParams} tooltip={t('school-tooltips:share')} />;
  const renderSubjectsTableBody = <SubjectTableBody subjects={subjects} />;
  const renderCourseTableBody = <CourseTableBody courses={courses} />;

  const renderSubjectsTable = (
    <PaginatedTable
      renderTableBody={renderSubjectsTableBody}
      count={subjectCount}
      extraFilters={variables}
    />
  );

  const renderCourseTable = (
    <PaginatedTable
      renderTableBody={renderCourseTableBody}
      count={courseCount}
      extraFilters={variables}
    />
  );

  const renderSubjectsNotFound = <NotFoundBox text={t('school:noSubjects')} />;
  const renderCoursesNotFound = <NotFoundBox text={t('school:noCourses')} />;
  const renderLeftTabContent = subjects.length ? renderSubjectsTable : renderSubjectsNotFound;
  const renderRightTabContent = courses.length ? renderCourseTable : renderCoursesNotFound;

  const renderAction = (
    <>
      {renderAddCourseButton}
      {renderShareButton}
      {renderInfoButton}
      {renderActionsButton}
    </>
  );

  const renderInfoDialogContent = <InfoDialogContent infoItems={infoItems} />;

  const renderInfoDialog = (
    <ResponsiveDialog
      open={infoDialogOpen}
      onClose={handleCloseInfoDialog}
      dialogHeaderProps={infoDialogHeaderProps}
    >
      {renderInfoDialogContent}
    </ResponsiveDialog>
  );

  const renderAddCourseAction = (
    <Link href={addCourseHref}>
      <MenuItem>
        <ListItemIcon>
          <AddCircleOutlineOutlined />
        </ListItemIcon>
        <ListItemText>{t('school:addCourse')}</ListItemText>
      </MenuItem>
    </Link>
  );

  const renderActionsDialogContent = (
    <List>
      {renderShareAction}
      {renderAddCourseAction}
    </List>
  );

  const renderActionsDialog = (
    <ResponsiveDialog
      open={actionsDialogOpen}
      onClose={handleCloseActionsDialog}
      dialogHeaderProps={actionsDialogHeaderProps}
      list
    >
      {renderActionsDialogContent}
    </ResponsiveDialog>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: isTabletOrDesktop && renderHeader, // School names are too long to be used as the header on mobile.
      renderHeaderLeft: renderAddCourseButton,
      renderHeaderRight: renderActionsButton,
      renderHeaderRightSecondary: renderInfoButton,
    },
    tabTemplateProps: {
      leftTabLabel: `${t('common:subjects')} (${subjectCount})`,
      rightTabLabel: `${t('common:courses')} (${courseCount})`,
      renderLeftTabContent,
      renderRightTabContent,
      renderAction,
    },
  };

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" seoProps={seoProps} />;
  }

  if (error) {
    return <ErrorTemplate variant="error" seoProps={seoProps} />;
  }

  return (
    <TabTemplate {...layoutProps}>
      {renderInfoDialog}
      {renderActionsDialog}
    </TabTemplate>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const apolloClient = initApolloClient();
  const t = await getT(locale, 'school');
  const variables = R.pick(['id', 'page', 'pageSize'], params);
  const context = getLanguageHeaderContext(locale);

  const { data, error = null } = await apolloClient.query({
    query: SchoolDocument,
    variables,
    context,
  });

  const school = R.prop('school', data);

  if (!school) {
    return {
      notFound: true,
    };
  }

  const schoolName = R.propOr('', 'name', school);

  const seoProps = {
    title: schoolName,
    description: t('description', { schoolName }),
  };

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      _ns: await loadNamespaces(['school', 'school-tooltips'], locale),
      seoProps,
      data,
      error,
    },
    revalidate: MAX_REVALIDATION_INTERVAL,
  };
};

export default withUserMe(SchoolDetailPage);
