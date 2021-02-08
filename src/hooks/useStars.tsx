import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import { useAuthContext, useDarkModeContext, useNotificationsContext } from 'context';
import { StarMutation, useStarMutation } from 'generated';
import React, { useEffect, useState } from 'react';

import { useLanguageHeaderContext } from './useLanguageHeaderContext';
import { useMediaQueries } from './useMediaQueries';

interface UseStarsParams {
  starred: boolean;
  initialStars: string;
  course?: string;
  resource?: string;
  starTooltip: string;
  unstarTooltip: string;
}

interface UseStars {
  stars: string;
  renderStarButton: JSX.Element | false;
}

// Keep track of current stars and render the star button for course and resource pages.
export const useStars = ({
  starred: initialStarred,
  initialStars,
  course,
  resource,
  unstarTooltip,
  starTooltip,
}: UseStarsParams): UseStars => {
  const { isTabletOrDesktop } = useMediaQueries();
  const { verified, userMe, loginRequiredTooltip, verificationRequiredTooltip } = useAuthContext();
  const { darkMode } = useDarkModeContext();
  const [stars, setStars] = useState('0');
  const [starred, setStarred] = useState(false);
  const iconColor = starred ? (darkMode ? 'secondary' : 'primary') : 'disabled';
  const textColor = starred ? (darkMode ? 'secondary' : 'primary') : 'textSecondary';
  const context = useLanguageHeaderContext();
  const { toggleUnexpectedErrorNotification: onError } = useNotificationsContext();

  useEffect(() => {
    setStarred(initialStarred);
  }, [initialStarred]);

  useEffect(() => {
    setStars(initialStars);
  }, [initialStars]);

  const tooltip =
    loginRequiredTooltip || verificationRequiredTooltip || (starred ? unstarTooltip : starTooltip);

  const onCompleted = ({ star }: StarMutation): void => {
    if (star?.errors?.length) {
      onError();
    } else if (star) {
      setStarred(!!star.starred);
      setStars(String(Number(stars) + (star.starred ? 1 : -1)));
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
        <Button
          onClick={handleStar}
          disabled={starSubmitting || !userMe || verified === false}
          size="small"
          startIcon={<StarBorderOutlined color={iconColor} />}
        >
          <Typography variant="subtitle1" color={textColor}>
            {stars}
          </Typography>
        </Button>
      </Typography>
    </Tooltip>
  );

  return { renderStarButton, stars };
};
