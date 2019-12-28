import {
  Avatar,
  Box,
  CardContent,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Typography
} from '@material-ui/core';
import { CloudUploadOutlined, SchoolOutlined, ScoreOutlined } from '@material-ui/icons';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { User } from '../../types';
import { useTabs } from '../../utils';
import { StyledList } from './StyledList';
import { TabPanel } from './TabPanel';

interface Props {
  user: User;
}

export const UserProfileCardContent: React.FC<Props> = ({ user }) => {
  const { t, i18n } = useTranslation();
  const { tabValue, handleTabChange } = useTabs();
  const username = user.username || '-';
  const avatar = user.avatar;
  const title = user.title || '-';
  const bio = user.bio || '-';
  const points = R.propOr('-', 'points', user);
  const courseCount = R.propOr('-', 'courseCount', user);
  const resourceCount = R.propOr('-', 'resourceCount', user);
  moment.locale(i18n.language); // Set moment language.
  const joined = moment(user.created).format('LL');

  const renderTopSection = (
    <Box className="flex-flow" display="flex" justifyContent="space-around" alignItems="center">
      <Avatar className="main-avatar" src={process.env.BACKEND_URL + avatar} />
      <CardContent>
        <StyledList>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ScoreOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              {t('common:points')}: {points}
            </ListItemText>
          </ListItem>
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
                <CloudUploadOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              {t('common:resources')}: {resourceCount}
            </ListItemText>
          </ListItem>
        </StyledList>
      </CardContent>
    </Box>
  );

  const renderAccountInfo = (
    <CardContent>
      <Box textAlign="left" marginTop="1rem">
        <Box display="flex" flexDirection="column" marginY="0.5rem">
          <Typography className="label" variant="body2" color="textSecondary">
            {t('common:username')}
          </Typography>
          <Typography variant="body1">{username}</Typography>
        </Box>
        <Box display="flex" flexDirection="column" marginY="0.5rem">
          <Typography className="label" variant="body2" color="textSecondary">
            {t('common:title')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {title}
          </Typography>
        </Box>
        <Typography className="label" variant="body2" color="textSecondary">
          {t('common:joined')} {joined}
        </Typography>
      </Box>
    </CardContent>
  );

  const renderBioSection = (
    <CardContent>
      <Box textAlign="left">
        <Typography className="label" variant="body2" color="textSecondary">
          {t('common:bio')}
        </Typography>
        <Typography variant="body1">{bio}</Typography>
      </Box>
    </CardContent>
  );

  const renderTabs = (
    <Tabs
      value={tabValue}
      onChange={handleTabChange}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
    >
      <Tab label={t('common:courses')} />
      <Tab label={t('common:resources')} />
    </Tabs>
  );

  const renderTabContent = (
    <CardContent>
      <TabPanel value={tabValue} index={0}>
        Courses will be here...
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        Resources will be here...
      </TabPanel>
    </CardContent>
  );

  return (
    <StyledUserProfileCardContent>
      {renderTopSection}
      <Divider />
      {renderAccountInfo}
      <Divider />
      {renderBioSection}
      <Divider />
      {renderTabs}
      {renderTabContent}
    </StyledUserProfileCardContent>
  );
};

const StyledUserProfileCardContent = styled(Box)`
  .label {
    font-size: 0.75rem;
  }
`;
