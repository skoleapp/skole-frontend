import Chip, { ChipProps } from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import { BadgeObjectType } from 'generated';
import React, { useMemo } from 'react';

import { BadgeTierIcon } from './BadgeTierIcon';

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
  badge: { name, tier, description },
  progress,
  steps,
  noTooltip = false,
  hoverable = false,
  ...props
}) => {
  const classes = useStyles();

  const progressText =
    progress !== undefined && steps !== undefined ? ` (${progress}/${steps})` : '';

  const renderBadgeLabel = useMemo(
    () => (
      <>
        <BadgeTierIcon tier={tier} /> {`${name}${progressText}`}
      </>
    ),
    [name, tier, progressText],
  );

  return (
    <Tooltip title={noTooltip ? '' : description}>
      <Chip
        className={clsx(classes.root, hoverable && classes.hoverable)}
        size="small"
        label={renderBadgeLabel}
        {...props}
      />
    </Tooltip>
  );
};
