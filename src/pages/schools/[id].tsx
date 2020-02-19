import {
    Avatar,
    Box,
    CardContent,
    CardHeader,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import { SchoolOutlined, SubjectOutlined } from '@material-ui/icons';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';

import {
    CourseObjectType,
    SchoolDetailDocument,
    SchoolObjectType,
    SubjectObjectType,
} from '../../../generated/graphql';
import {
    NotFound,
    ResponsiveMainLayout,
    StyledList,
    StyledTable,
    StyledTabs,
    TabPanel,
    TextLink,
} from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces, Router } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { usePrivatePage, useTabs } from '../../utils';

interface Props extends I18nProps {
    school?: SchoolObjectType;
}

const SchoolDetailPage: I18nPage<Props> = ({ school }) => {
    const { t } = useTranslation();
    const { tabValue, handleTabChange } = useTabs();

    if (school) {
        const schoolName = R.propOr('-', 'name', school) as string;
        const schoolType = R.propOr('-', 'schoolType', school) as string;
        const country = R.propOr('-', 'country', school) as string;
        const city = R.propOr('-', 'city', school) as string;
        const courseCount = R.propOr('-', 'courseCount', school);
        const subjectCount = R.propOr('-', 'subjectCount', school);
        const subjects = R.propOr([], 'subjects', school) as SubjectObjectType[];
        const courses = R.propOr([], 'courses', school) as CourseObjectType[];

        const schoolTypeLink = {
            pathname: '/search',
            query: { schoolType: R.propOr('', 'schoolType', school) as boolean[] },
        };

        const countryLink = {
            pathname: '/search',
            query: { countryName: R.propOr('', 'country', school) as boolean[] },
        };

        const cityLink = {
            pathname: '/search',
            query: { cityName: R.propOr('', 'city', school) as boolean[] },
        };

        const renderCardHeader = <CardHeader title={schoolName} />;

        const renderLeftCardContent = (
            <CardContent>
                <Box textAlign="left">
                    <Typography variant="body1">
                        {t('common:schoolType')}:{' '}
                        <TextLink href={schoolTypeLink} color="primary">
                            {schoolType}
                        </TextLink>
                    </Typography>
                    <Typography variant="body1">
                        {t('common:country')}:{' '}
                        <TextLink href={countryLink} color="primary">
                            {country}
                        </TextLink>
                    </Typography>
                    <Typography variant="body1">
                        {t('common:city')}:{' '}
                        <TextLink href={cityLink} color="primary">
                            {city}
                        </TextLink>
                    </Typography>
                </Box>
            </CardContent>
        );

        const renderRightCardContent = (
            <CardContent>
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
            </CardContent>
        );

        const renderTabs = (
            <>
                <StyledTabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label={t('common:subjects')} />
                    <Tab label={t('common:courses')} />
                </StyledTabs>
                <TabPanel value={tabValue} index={0}>
                    {subjects.length ? (
                        <StyledTable disableBoxShadow>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                {t('common:name')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {subjects.map((s: SubjectObjectType, i: number) => (
                                        <TableRow
                                            key={i}
                                            onClick={(): Promise<boolean> =>
                                                Router.push({ pathname: '/search', query: { subject: s.id } })
                                            }
                                        >
                                            <TableCell>
                                                <Typography variant="subtitle1">{R.propOr('-', 'name', s)}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </StyledTable>
                    ) : (
                        <CardContent>
                            <Typography variant="subtitle1">{t('school:noSubjects')}</Typography>
                        </CardContent>
                    )}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    {courses.length ? (
                        <StyledTable disableBoxShadow>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                {t('common:name')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="subtitle1" color="textSecondary">
                                                {t('common:points')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {courses.map((c: CourseObjectType, i: number) => (
                                        <TableRow
                                            key={i}
                                            onClick={(): Promise<boolean> => Router.push(`/courses/${c.id}`)}
                                        >
                                            <TableCell>
                                                <Typography variant="subtitle1">{R.propOr('-', 'name', c)}</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="subtitle1">
                                                    {R.propOr('-', 'points', c)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </StyledTable>
                    ) : (
                        <CardContent>
                            <Typography variant="subtitle1">{t('school:noCourses')}</Typography>
                        </CardContent>
                    )}
                </TabPanel>
            </>
        );

        return (
            <ResponsiveMainLayout
                title={schoolName}
                backUrl
                renderCardHeader={renderCardHeader}
                renderLeftCardContent={renderLeftCardContent}
                renderRightCardContent={renderRightCardContent}
                renderTabs={renderTabs}
            />
        );
    } else {
        return <NotFound title={t('school:notFound')} />;
    }
};

SchoolDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    await usePrivatePage(ctx);
    const { apolloClient, query } = ctx;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['school']) };

    try {
        const { data } = await apolloClient.query({
            query: SchoolDetailDocument,
            variables: query,
        });

        return { ...data, ...nameSpaces };
    } catch {
        return nameSpaces;
    }
};

export default compose(withApollo, withRedux)(SchoolDetailPage);
