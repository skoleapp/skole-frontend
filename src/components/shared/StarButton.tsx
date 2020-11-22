import { IconButton, IconButtonProps, Tooltip, Typography } from '@material-ui/core';
import { StarBorderOutlined } from '@material-ui/icons';
import { useAuthContext, useNotificationsContext } from 'context';
import { StarMutation, useStarMutation } from 'generated';
import { useLanguageHeaderContext } from 'hooks';
import { useTranslation } from 'lib';
import React, { useState } from 'react';

interface Props extends IconButtonProps {
  starred: boolean;
  course?: string;
  resource?: string;
}

export const StarButton: React.FC<Props> = ({ starred: initialStarred, course, resource }) => {
  const { t } = useTranslation();

  const { verified, userMe, loginRequiredTooltip, verificationRequiredTooltip } = useAuthContext();

  const [starred, setStarred] = useState(initialStarred);
  const color = starred ? 'primary' : 'default';
  const { toggleNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();

  const tooltip =
    loginRequiredTooltip ||
    verificationRequiredTooltip ||
    (starred ? t('tooltips:unstar') : t('tooltips:star') || '');

  const onError = (): void => toggleNotification(t('notifications:starError'));

  const onCompleted = ({ star }: StarMutation): void => {
    if (star) {
      if (!!star.errors && !!star.errors.length) {
        onError();
      } else {
        setStarred(!!star.starred);
      }
    }
  };

  const [star, { loading: starSubmitting }] = useStarMutation({
    onCompleted,
    onError,
    context,
  });

  const handleStar = async (): Promise<void> => {
    await star({ variables: { course, resource } });
  };

  return (
    <Tooltip title={tooltip}>
      <Typography component="span">
        <IconButton
          onClick={handleStar}
          disabled={starSubmitting || !userMe || verified === false}
          size="small"
          color={color}
        >
          <StarBorderOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );
};
