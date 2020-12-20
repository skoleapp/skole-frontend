import { IconButton, Tooltip, Typography } from '@material-ui/core';
import { StarBorderOutlined } from '@material-ui/icons';
import { useAuthContext, useNotificationsContext } from 'context';
import { StarMutation, useStarMutation } from 'generated';
import { useLanguageHeaderContext, useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React, { useEffect, useState } from 'react';

interface UseStarsParams {
  starred: boolean;
  initialStars: string;
  course?: string;
  resource?: string;
}

interface UseStars {
  stars: string;
  renderStarButton: JSX.Element | false;
}

export const useStars = ({
  starred: initialStarred,
  initialStars,
  course,
  resource,
}: UseStarsParams): UseStars => {
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();
  const { verified, userMe, loginRequiredTooltip, verificationRequiredTooltip } = useAuthContext();
  const [stars, setStars] = useState(initialStars);
  const [starred, setStarred] = useState(initialStarred);
  const color = starred ? 'primary' : 'default';
  const context = useLanguageHeaderContext();
  const { toggleNotification } = useNotificationsContext();
  const onError = (): void => toggleNotification(t('notifications:starError'));

  useEffect(() => {
    setStars(initialStars);
  }, [initialStars]);

  const tooltip =
    loginRequiredTooltip ||
    verificationRequiredTooltip ||
    (starred ? t('tooltips:unstar') : t('tooltips:star') || '');

  const onCompleted = ({ star }: StarMutation): void => {
    if (star) {
      if (!!star.errors && !!star.errors.length) {
        onError();
      } else {
        setStarred(!!star.starred);
        setStars(String(Number(stars) + (star.starred ? 1 : -1)));
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

  // On desktop, render a disabled button for non-verified users.
  // On mobile, do not render the button at all for non-verified users.
  const renderStarButton = (!!verified || isTabletOrDesktop) && (
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

  return { renderStarButton, stars };
};
