import styled from 'styled-components';
import { Button } from '.';

const getBackgroundForVaraint = (variant: string): string => {
  switch (variant) {
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
  variant: string;
  selected: boolean;
}

export const FeedbackButton = styled(Button)<Props>`
  background: ${({ variant }): string => getBackgroundForVaraint(variant)};
  color: var(--white);
  text-shadow: var(--text-shadow);
  opacity: ${({ selected }): string => (selected ? '1' : '0.5')};
  width: 5rem;
`;
