import Chip, { ChipProps } from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import { BadgeObjectType, BadgeTier } from 'generated';
import React from 'react';

import { Emoji } from './Emoji';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    margin: spacing(1),
  },
  hoverable: {
    cursor: 'pointer',
  },
}));

interface Props extends ChipProps {
  badge: BadgeObjectType;
  progress?: number;
  steps?: number;
  noTooltip?: boolean;
  hoverable?: boolean;
}

export const Badge: React.FC<Props> = ({
  badge,
  progress,
  steps,
  noTooltip = false,
  hoverable = false,
  ...props
}) => {
  const classes = useStyles();

  // TODO: Change the emoji's to better looking SVG icons.
  const renderBadgeTier = (tier: BadgeTier): JSX.Element | void => {
    switch (tier) {
      case BadgeTier.Diamond: {
        return <Emoji emoji="💎" noSpace />;
      }

      case BadgeTier.Gold: {
        return <Emoji emoji="🟡" noSpace />;
      }

      case BadgeTier.Silver: {
        return <Emoji emoji="⚪" noSpace />;
      }

      case BadgeTier.Bronze: {
        return <Emoji emoji="🟤" noSpace />;
      }

      default: {
        break;
      }
    }
  };
  const progressText =
    progress !== undefined && steps !== undefined ? ` (${progress}/${steps})` : '';

  const renderBadgeLabel = (
    <>
      {renderBadgeTier(badge.tier)} {`${badge.name}${progressText}`}
    </>
  );

  return (
    <Tooltip title={noTooltip ? '' : badge.description}>
      <Chip
        className={clsx(classes.root, hoverable && classes.hoverable)}
        size="small"
        label={renderBadgeLabel}
        {...props}
      />
    </Tooltip>
  );
};
