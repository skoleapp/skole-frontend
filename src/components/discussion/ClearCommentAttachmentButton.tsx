import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ClearOutlined from '@material-ui/icons/ClearOutlined';
import { useDiscussionContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

export const ClearCommentAttachmentButton: React.FC = () => {
  const { setCommentAttachment, commentAttachment, formRef } = useDiscussionContext();
  const { t } = useTranslation();

  const handleClearAttachment = (): void => {
    formRef.current?.setFieldValue('attachment', null);
    setCommentAttachment(null);
  };

  // For anonymous users and user without verification that are on mobile, hide the entire button.
  return commentAttachment ? (
    <Tooltip title={t('discussion-tooltips:clearAttachment')}>
      <Typography component="span">
        <IconButton onClick={handleClearAttachment} size="small">
          <ClearOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  ) : null;
};
