import { List, ListItemIcon, ListItemText, MenuItem, Tooltip, Typography } from '@material-ui/core';
import { AddCircleOutlineOutlined } from '@material-ui/icons';
import {
  CourseTableBody,
  ErrorTemplate,
  IconButtonLink,
  InfoDialogContent,
  LoadingTemplate,
  NotFoundBox,
  PaginatedTable,
  ResponsiveDialog,
  ShareButton,
  TextLink,
  SubjectTableBody,
  TabTemplate,
} from 'components';
import { useAuthContext } from 'context';
import { useSchoolQuery } from 'generated';
import { withUserMe } from 'hocs';
import {
  useActionsDialog,
  useInfoDialog,
  useLanguageHeaderContext,
  useMediaQueries,
  useSearch,
} from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { urls } from 'utils';

const SchoolDetailPage: NextPage = () => {
  const { verified, verificationRequiredTooltip } = useAuthContext();
  const { t } = useTranslation();
  const { isTabletOrDesktop, isMobile } = useMediaQueries();
  const { searchUrl } = useSearch();
  const { query } = useRouter();
  const variables = R.pick(['id', 'page', 'pageSize'], query);
  const context = useLanguageHeaderContext();
  const { data, loading, error } = useSchoolQuery({ variables, context });
  const school = R.propOr(null, 'school', data);
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

  const {
    infoDialogOpen,
    infoDialogHeaderProps,
    renderInfoButton,
    handleCloseInfoDialog,
  } = useInfoDialog({
    header: t('school:infoHeader'),
    infoButtonTooltip: t('school-tooltips:info'),
  });

  const addCourseHref = {
    pathname: urls.addCourse,
    query: { school: schoolId },
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
      label: t('common:name'),
      value: schoolName,
    },
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

  const commonTableHeadProps = {
    titleLeft: t('common:name'),
  };

  const courseTableHeadProps = {
    ...commonTableHeadProps,
    titleRight: t('common:score'),
  };

  const renderSubjectsTable = (
    <PaginatedTable
      tableHeadProps={commonTableHeadProps}
      renderTableBody={renderSubjectsTableBody}
      count={subjectCount}
      extraFilters={variables}
    />
  );

  const renderCourseTable = (
    <PaginatedTable
      tableHeadProps={courseTableHeadProps}
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
    seoProps: {
      title: schoolName,
      description: t('school:description', { schoolName }),
    },
    topNavbarProps: {
      dynamicBackUrl: true,
      headerLeft: renderAddCourseButton,
      headerRight: renderActionsButton,
      headerRightSecondary: renderInfoButton,
    },
    cardHeader: schoolName,
    leftTabLabel: `${t('common:subjects')} (${subjectCount})`,
    rightTabLabel: `${t('common:courses')} (${courseCount})`,
    renderLeftTabContent,
    renderRightTabContent,
    renderAction,
  };

  if (loading) {
    return <LoadingTemplate />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" />;
  }

  if (error) {
    return <ErrorTemplate variant="error" />;
  }

  if (school) {
    return (
      <TabTemplate {...layoutProps}>
        {renderInfoDialog}
        {renderActionsDialog}
      </TabTemplate>
    );
  }

  return <ErrorTemplate variant="not-found" />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['school', 'school-tooltips'], locale),
  },
});

export default withUserMe(SchoolDetailPage);
