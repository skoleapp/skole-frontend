import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { Skeleton } from '@material-ui/lab';
import React from 'react';

export const SkeletonActivityPreviewList: React.FC = () => (
  <>
    {new Array(4).fill(0).map((_, i) => (
      <ListItem className="activity-li" key={i}>
        <ListItemAvatar>
          <Skeleton variant="circle">
            <Avatar />
          </Skeleton>
        </ListItemAvatar>
        <ListItemText>
          <Skeleton />
        </ListItemText>
      </ListItem>
    ))}
  </>
);
