import { Card } from '@material-ui/core';
import styled from 'styled-components';
import { breakpoints } from '../styles';

export const StyledCard = styled(Card)`
  padding: 1rem;

  @media only screen and (min-width: ${breakpoints.SM}) {
    max-width: 25rem;
  }

  .MuiButton-root,
  .MuiLink-underlineHover {
    margin: 0.5rem 0 !important;
  }

  .info-section {
    margin-top: 1rem;

    p {
      margin: 0.5rem 0;
    }
  }

  .MuiAvatar-root {
    margin: 1rem auto;
    height: 12rem;
    width: 12rem;
  }

  @media screen and (min-width: ${breakpoints.SM}) {
    margin: 0 auto;
  }
`;
