import { Card } from '@material-ui/core';
import styled from 'styled-components';
import { breakpoints } from '../../styles';

export const StyledCard = styled(Card)`
  margin: 0 auto;
  width: 100%;

  @media only screen and (max-width: ${breakpoints.SM}) {
    flex-grow: 1;
  }

  @media only screen and (min-width: ${breakpoints.SM}) {
    max-width: 35rem;
  }

  .MuiCardHeader-title {
    text-align: center;
  }

  .MuiButton-root {
    margin-top: 0.5rem;
  }

  .main-avatar {
    height: 8rem;
    width: 8rem;

    @media only screen and (min-width: ${breakpoints.SM}) {
      height: 12rem;
      width: 12rem;
    }
  }
`;
