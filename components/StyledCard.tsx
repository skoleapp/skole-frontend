import { Card } from '@material-ui/core';
import styled from 'styled-components';
import { breakpoints } from '../styles';

export const StyledCard = styled(Card)`
  padding: 1rem;
  min-height: 100vh;

  @media only screen and (min-width: ${breakpoints.SM}) {
    max-width: 35rem;
    margin: 0 auto;
    min-height: auto;
  }

  .MuiButton-root,
  .MuiDivider-root {
    margin: 0.5rem 0;
  }

  .MuiAvatar-root {
    height: 6rem;
    width: 6rem;

    @media only screen and (min-width: ${breakpoints.SM}) {
      height: 10rem;
      width: 10rem;
    }
  }
`;
