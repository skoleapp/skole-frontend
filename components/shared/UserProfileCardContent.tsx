import {
  Avatar,
  Box,
  CardContent,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@material-ui/core';
import { CloudUploadOutlined, SchoolOutlined, ScoreOutlined } from '@material-ui/icons';
import React from 'react';
import { StyledList } from './StyledList';

interface Props {
  username: string;
  title: string;
  bio: string;
  avatar: string;
  points: number | string;
  courseCount: number | string;
  resourceCount: number | string;
}

export const UserProfileCardContent: React.FC<Props> = ({
  avatar,
  username,
  title,
  bio,
  points,
  courseCount,
  resourceCount
}) => {
  const renderAvatarSection = (
    <CardContent>
      <Avatar className="main-avatar" src={process.env.BACKEND_URL + avatar} />
      <Typography variant="body1">{username}</Typography>
      <Typography variant="body2" color="textSecondary">
        {title}
      </Typography>
    </CardContent>
  );

  const renderAccountInfoList = (
    <CardContent>
      <StyledList>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <ScoreOutlined />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>Points: {points}</ListItemText>
        </ListItem>
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
              <CloudUploadOutlined />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>Resources: {resourceCount}</ListItemText>
        </ListItem>
      </StyledList>
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
