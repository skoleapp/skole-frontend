import styled from 'styled-components';
import { XS } from '../../utils';

export const Card = styled.div`
  border: var(--black-border);
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin: 0 1rem;
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 25rem;

  @media screen and (min-width: ${XS}) {
    margin: 0 auto;
  }
`;
