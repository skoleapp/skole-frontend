import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useDiscussionContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

import { Emoji } from '../shared';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    textAlign: 'left',
    marginLeft: spacing(2),
  },
  content: {
    overflow: 'hidden',
  },
  title: {
    color: palette.text.secondary,
  },
}));

interface Props {
  renderShareButton: JSX.Element;
  renderInfoButton: JSX.Element;
  renderActionsButton?: JSX.Element;
}

export const DiscussionHeader: React.FC<Props> = ({
  renderShareButton,
  renderInfoButton,
  renderActionsButton,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { commentCount } = useDiscussionContext();
  const title = t('discussion:commentCount', { commentCount });

  const renderEmoji = <Emoji emoji="💬" />;

  const renderTitle = (
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
      classes={{
        root: classes.root,
        content: classes.content,
        title: clsx('MuiCardHeader-title', classes.title, 'truncate-text'),
      }}
      title={renderTitle}
      action={renderAction}
    />
  );
};
