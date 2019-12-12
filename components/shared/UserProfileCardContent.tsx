import {
  Avatar,
  Box,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@material-ui/core';
import { CloudUploadOutlined, SchoolOutlined, ScoreOutlined } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';
import { PublicUser } from '../../interfaces';
import { getAvatar } from '../../utils';

interface Props extends Omit<PublicUser, 'id'> {
  t: (value: string) => any;
}

export const UserProfileCardContent: React.FC<Props> = ({
  avatar,
  username,
  title,
  bio,
  points,
  courses,
  resources,
  t
}) => {
  const renderAvatarSection = (
    <CardContent>
      <Avatar className="main-avatar" src={getAvatar(avatar)} />
      <Typography variant="body1">{username}</Typography>
      <Typography variant="body2" color="textSecondary">
        {title}
      </Typography>
    </CardContent>
  );

  const renderAccountInfoList = (
    <CardContent>
      <StyledAccountInfoList>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <ScoreOutlined />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            {t('headerPoints')}: {points}
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <SchoolOutlined />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            {t('headerCourses')}: {courses}
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CloudUploadOutlined />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            {t('headerResources')}: {resources}
          </ListItemText>
        </ListItem>
      </StyledAccountInfoList>
    </CardContent>
  );

  const renderTopSection = (
    <Box className="flex-flow" display="flex" justifyContent="space-around" alignItems="center">
      {renderAvatarSection}
      {renderAccountInfoList}
    </Box>
  );

  const renderBioSection = (
    <CardContent>
      <Box textAlign="left">
        <Typography variant="body2" color="textSecondary">
          {t('headerBio')}
        </Typography>
        <Typography variant="body1">{bio}</Typography>
      </Box>
    </CardContent>
  );

  const renderCoursesSection = (
    <CardContent>
      <Box textAlign="left">
        <Typography variant="body2" color="textSecondary">
          {t('headerCourses')}
        </Typography>
        <Typography variant="body1">--Course stuff--</Typography>
      </Box>
    </CardContent>
  );

  const renderResourcesSection = (
    <CardContent>
      <Box textAlign="left">
        <Typography variant="body2" color="textSecondary">
          {t('headerResources')}
        </Typography>
        <Typography variant="body1">--Resource stuff--</Typography>
      </Box>
    </CardContent>
  );

  return (
    <>
      {renderTopSection}
      <Divider />
      {renderBioSection}
      <Divider />
      {renderCoursesSection}
      <Divider />
      {renderResourcesSection}
    </>
  );
};

const StyledAccountInfoList = styled(List)`
  .MuiAvatar-root {
    background-color: var(--primary);
  }
`;
