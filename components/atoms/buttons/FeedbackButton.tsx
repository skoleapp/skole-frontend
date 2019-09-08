import styled from 'styled-components';
import { Button } from './Button';

const getBackgroundForVaraint = (variant: string): string => {
  switch (variant) {
    case 'good':
      return 'var(--green)';
    case 'ok':
      return 'var(--yellow)';
    case 'bad':
      return 'var(--red)';
    default:
      return 'var(--white)';
  }
};

interface Props {
  variant: string;
  selected: boolean;
}

export const FeedbackButton = styled(Button)<Props>`
  background: ${({ variant }) => getBackgroundForVaraint(variant)};
  border: 0.1rem solid var(--black);
  color: var(--white);
  text-shadow: 0.1rem 0.1rem 0.1rem var(--black);
  opacity: ${({ selected }): string => (selected ? '1' : '0.5')};

  &:hover {
    transform: var(--scale);
    transition: var(--transition);
  }

  &:focus {
    outline: none;
  }
`;
