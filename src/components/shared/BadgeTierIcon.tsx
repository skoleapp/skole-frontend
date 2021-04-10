import { TypographyProps } from '@material-ui/core/Typography';
import { BadgeTier } from 'generated';
import React from 'react';

import { Emoji } from './Emoji';

interface Props extends Pick<TypographyProps, 'className'> {
  tier: BadgeTier;
}

// TODO: Change the emoji's to better looking SVG icons.
export const BadgeTierIcon: React.FC<Props> = ({ tier, ...props }) => {
  switch (tier) {
    case BadgeTier.Diamond: {
      return <Emoji emoji="💎" noSpace {...props} />;
    }

    case BadgeTier.Gold: {
      return <Emoji emoji="🟡" noSpace {...props} />;
    }

    case BadgeTier.Silver: {
      return <Emoji emoji="⚪" noSpace {...props} />;
    }

    case BadgeTier.Bronze: {
      return <Emoji emoji="🟤" noSpace {...props} />;
    }

    default: {
      return null;
    }
  }
};
