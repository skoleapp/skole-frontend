import { Card } from '@material-ui/core';
import styled from 'styled-components';
import { XS } from '../../utils';

export const StyledCard = styled(Card)`
  padding: 1rem;
  margin: 0 1rem;
  max-width: 25rem;

  @media screen and (min-width: ${XS}) {
    margin: 0 auto;
  }
`;
