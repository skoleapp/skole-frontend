import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import { useAuthContext, useNotificationsContext } from 'context';
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
  const [stars, setStars] = useState('0');
  const [starred, setStarred] = useState(false);
  const color = starred ? 'primary' : 'default';
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
