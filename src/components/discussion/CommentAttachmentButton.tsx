import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AttachFileOutlined from '@material-ui/icons/AttachFileOutlined';
import CameraAltOutlined from '@material-ui/icons/CameraAltOutlined';
import { useAuthContext, useDiscussionContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

export const CommentAttachmentButton: React.FC = () => {
  const { attachmentInputRef } = useDiscussionContext();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const { userMe, verified, loginRequiredTooltip, verificationRequiredTooltip } = useAuthContext();
  const { t } = useTranslation();

  const tooltip =
    loginRequiredTooltip || verificationRequiredTooltip || t('discussion-tooltips:attachFile');

  const handleUploadAttachment = (): false | void => attachmentInputRef.current.click();

  // For anonymous users and user without verification that are on mobile, hide the entire button.
  return (isMobile && !!userMe && !!verified) || isTabletOrDesktop ? (
    <Tooltip title={tooltip}>
      <Typography component="span">
        <IconButton
          onClick={handleUploadAttachment}
          disabled={verified === false || !userMe}
          size="small"
        >
          {isMobile ? <CameraAltOutlined /> : <AttachFileOutlined />}
        </IconButton>
      </Typography>
    </Tooltip>
  ) : null;
};
