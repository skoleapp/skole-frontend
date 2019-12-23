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
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../interfaces';
import { StyledList } from './StyledList';

interface Props {
  user: User;
}

export const UserProfileCardContent: React.FC<Props> = ({ user }) => {
  const { t } = useTranslation();

  const username = user.username || t('profile:usernameNa');
  const avatar = user.avatar;
  const title = user.title || t('profile:titleNa');
  const bio = user.bio || t('profile:bioNa');
  const points = R.propOr(t('common:na'), 'points', user);
  const courseCount = R.propOr(t('common:na'), 'courseCount', user);
  const resourceCount = R.propOr(t('common:na'), 'resourceCount', user);

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
          <ListItemText>{t('profile:points', { points })}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <SchoolOutlined />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>{t('profile:courseCount', { courseCount })}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CloudUploadOutlined />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>{t('profile:resourceCount', { resourceCount })}</ListItemText>
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
          {t('profile:bio')}
        </Typography>
        <Typography variant="body1">{bio}</Typography>
      </Box>
    </CardContent>
  );

  const renderCoursesSection = (
    <CardContent>
      <Box textAlign="left">
        <Typography variant="body2" color="textSecondary">
          {t('profile:courses')}
        </Typography>
        <Typography variant="body1">Courses will show here...</Typography>
      </Box>
    </CardContent>
  );

  const renderResourcesSection = (
    <CardContent>
      <Box textAlign="left">
        <Typography variant="body2" color="textSecondary">
          {t('profile:resources')}
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
