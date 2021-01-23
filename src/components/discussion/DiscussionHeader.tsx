import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'lib';
import React from 'react';

import { Emoji } from '../shared';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    textAlign: 'left',
    marginLeft: spacing(2),
  },
  subheader: {
    color: palette.text.secondary,
  },
}));

interface Props {
  commentCount: number;
  renderShareButton: JSX.Element;
  renderInfoButton: JSX.Element;
  renderActionsButton: JSX.Element;
}

export const DiscussionHeader: React.FC<Props> = ({
  commentCount,
  renderShareButton,
  renderInfoButton,
  renderActionsButton,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const title = `${t('common:discussion')} (${t('discussion:commentCount', { commentCount })})`;

  const renderEmoji = <Emoji emoji="💬" />;

  const renderSubheader = (
    <>
      {title}
      {renderEmoji}
    </>
  );

  const renderAction = (
    <>
      {renderShareButton}
      {renderInfoButton}
      {renderActionsButton}
    </>
  );

  return (
    <CardHeader
      classes={{ root: classes.root, subheader: classes.subheader }}
      subheader={renderSubheader}
      action={renderAction}
    />
  );
};
