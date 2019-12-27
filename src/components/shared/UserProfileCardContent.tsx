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
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../types';
import { StyledList } from './StyledList';

interface TabPanelProps {
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...props }) => (
  <Typography
    // component="div"
    role="tabpanel"
    hidden={value !== index}
    {...props}
  >
    {value === index && <Box p={3}>{children}</Box>}
  </Typography>
);

interface Props {
  user: User;
}

export const UserProfileCardContent: React.FC<Props> = ({ user }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const handleChange = (_e: ChangeEvent<{}>, val: number) => setValue(val);

  const username = user.username || t('profile:usernameNA');
  const avatar = user.avatar;
  const title = user.title || t('profile:titleNA');
  const bio = user.bio || t('profile:bioNA');
  const points = R.propOr(t('common:NA'), 'points', user);
  const courseCount = R.propOr(t('common:NA'), 'courseCount', user);
  const resourceCount = R.propOr(t('common:NA'), 'resourceCount', user);

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
          <ListItemText>{t('common:points', { points })}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <SchoolOutlined />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>{t('common:courseCount', { courseCount })}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CloudUploadOutlined />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>{t('common:resourceCount', { resourceCount })}</ListItemText>
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
          {t('common:bio')}
        </Typography>
        <Typography variant="body1">{bio}</Typography>
      </Box>
    </CardContent>
  );

  const renderTabs = (
    <Tabs
      value={value}
      onChange={handleChange}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
    >
      <Tab label="Courses" />
      <Tab label="Resources" />
    </Tabs>
  );

  const renderTabContent = (
    <CardContent>
      <TabPanel value={value} index={0}>
        Courses will show here...
      </TabPanel>
      <TabPanel value={value} index={1}>
        Resources will show here...
      </TabPanel>
    </CardContent>
  );

  return (
    <>
      {renderTopSection}
      <Divider />
      {renderBioSection}
      <Divider />
      {renderTabs}
      {renderTabContent}
    </>
  );
};
