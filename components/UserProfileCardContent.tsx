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
import { PublicUser } from '../interfaces';
import { getAvatar } from '../utils';

interface Props extends Omit<PublicUser, 'id'> {
  isPrivate?: boolean;
}

export const UserProfileCardContent: React.FC<Props> = ({
  avatar,
  username,
  title,
  bio,
  points,
  courses,
  resources
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
          <ListItemText primary={`Points: ${points}`} />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <SchoolOutlined />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={`Courses: ${courses}`} />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CloudUploadOutlined />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={`Resources: ${resources}`} />
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
          Bio
        </Typography>
        <Typography variant="body1">{bio}</Typography>
      </Box>
    </CardContent>
  );

  const renderCoursesSection = (
    <CardContent>
      <Box textAlign="left">
        <Typography variant="body2" color="textSecondary">
          Courses
        </Typography>
        <Typography variant="body1">Courses will show here...</Typography>
      </Box>
    </CardContent>
  );

  const renderResourcesSection = (
    <CardContent>
      <Box textAlign="left">
        <Typography variant="body2" color="textSecondary">
          Resources
        </Typography>
        <Typography variant="body1">Resources will show here...</Typography>
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
