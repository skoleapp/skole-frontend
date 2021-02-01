import imageCompression from 'browser-image-compression';
import { useAuthContext, useDiscussionContext, useNotificationsContext } from 'context';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent } from 'react';
import {
  ACCEPTED_ATTACHMENT_FILES,
  MAX_COMMENT_ATTACHMENT_FILE_SIZE,
  MAX_COMMENT_ATTACHMENT_WIDTH_HEIGHT,
} from 'utils';

interface Props {
  dialog?: boolean;
}

export const CommentAttachmentInput: React.FC<Props> = ({ dialog }) => {
  const {
    attachmentInputRef,
    setCreateCommentDialogOpen,
    formRef,
    setCommentAttachment,
  } = useDiscussionContext();

  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const { toggleNotification } = useNotificationsContext();

  const setAttachment = (file: File | Blob) => {
    formRef.current?.setFieldValue('attachment', file);
    dialog && setCreateCommentDialogOpen(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = (): void => {
      setCommentAttachment(reader.result);
    };
  };

  // Automatically resize the image and update the field value.
  const handleAttachmentChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file: File = R.path(['currentTarget', 'files', '0'], e);

    const options = {
      maxSizeMB: MAX_COMMENT_ATTACHMENT_FILE_SIZE / 1000000,
      maxWidthOrHeight: MAX_COMMENT_ATTACHMENT_WIDTH_HEIGHT,
    };

    if (file.size > MAX_COMMENT_ATTACHMENT_FILE_SIZE) {
      try {
        const compressedFile = await imageCompression(file, options);
        setAttachment(compressedFile);
      } catch {
        toggleNotification(t('validation:fileSizeError'));
      }
    } else {
      setAttachment(file);
    }
  };

  return (
    <input
      ref={attachmentInputRef}
      value=""
      type="file"
      accept={ACCEPTED_ATTACHMENT_FILES.toString()}
      onChange={handleAttachmentChange}
      disabled={!userMe}
    />
  );
};
