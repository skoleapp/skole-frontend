import { CardHeader, makeStyles, Typography } from '@material-ui/core';
import { ChatOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import React from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  subheader: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing(1),
  },
}));

interface Props {
  commentCount: number;
  renderStarButton: JSX.Element | false;
  renderUpVoteButton: JSX.Element;
  renderDownVoteButton: JSX.Element;
  renderShareButton: JSX.Element;
  renderInfoButton: JSX.Element;
  renderActionsButton: JSX.Element;
}

export const DiscussionHeader: React.FC<Props> = ({
  commentCount,
  renderStarButton,
  renderUpVoteButton,
  renderDownVoteButton,
  renderShareButton,
  renderInfoButton,
  renderActionsButton,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const title = `${t('common:discussion')} (${commentCount})`;
  const renderIcon = <ChatOutlined className={classes.icon} color="disabled" />;

  const renderSubheader = (
    <Typography
      className={classes.subheader}
      variant="subtitle1"
      color="textSecondary"
      align="left"
    >
      {renderIcon} {title}
    </Typography>
  );

  const renderAction = (
    <>
      {renderStarButton}
      {renderUpVoteButton}
      {renderDownVoteButton}
      {renderShareButton}
      {renderInfoButton}
      {renderActionsButton}
    </>
  );

  return <CardHeader subheader={renderSubheader} action={renderAction} />;
};
