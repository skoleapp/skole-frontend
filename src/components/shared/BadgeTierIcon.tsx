import { BadgeTier } from 'generated';
import React from 'react';

import { Emoji } from './Emoji';

interface Props {
  tier: BadgeTier;
}

// TODO: Change the emoji's to better looking SVG icons.
export const BadgeTierIcon: React.FC<Props> = ({ tier }) => {
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
      return null;
    }
  }
};
