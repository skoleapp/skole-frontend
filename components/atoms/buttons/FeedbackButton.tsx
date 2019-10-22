import styled from 'styled-components';
import { SM } from '../../../utils';
import { Button } from './Button';

interface Props {
  value: string;
  selected: boolean;
}

export const FeedbackButton = styled(Button)<Props>`
  background: ${(props): string => props.color || 'var(--primary)'};
  color: var(--black);
  text-shadow: var(--text-shadow);
  opacity: ${({ selected }): string => (selected ? '1' : '0.5')};

  @media screen and (min-width: ${SM}) {
    width: 7rem;
  }
`;
