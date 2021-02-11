import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import { useDiscussionContext } from 'context';
import { useTranslation } from 'lib';
import Image from 'next/image';
import React from 'react';

export const CommentAttachmentPreview: React.FC<FormControlProps> = (props) => {
  const { t } = useTranslation();
  const { commentAttachment } = useDiscussionContext();

  return commentAttachment ? (
    <FormControl {...props}>
      <Image
        layout="responsive"
        width={1280}
        height={720}
        src={String(commentAttachment)}
        alt={t('discussion:attachmentAlt')}
        objectFit="contain"
      />
    </FormControl>
  ) : null;
};
