import styled from 'styled-components';
import { SM } from '../../../static';
import { Button } from './Button';

const getBackgroundForValue = (value: string): string => {
  switch (value) {
    case 'good':
      return 'var(--good-button)';
    case 'ok':
      return 'var(--neutral-button)';
    case 'bad':
      return 'var(--negative-button)';
    default:
      return 'var(--primary)';
  }
};

interface Props {
  value: string;
  selected: boolean;
}

export const FeedbackButton = styled(Button)<Props>`
  background: ${({ value }): string => getBackgroundForValue(value)};
  color: var(--white);
  text-shadow: var(--text-shadow);
  opacity: ${({ selected }): string => (selected ? '1' : '0.5')};

  @media screen and (min-width: ${SM}) {
    width: 7rem;
  }
`;
