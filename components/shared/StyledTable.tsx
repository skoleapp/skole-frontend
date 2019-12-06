import { Paper } from '@material-ui/core';
import styled from 'styled-components';
import { breakpoints } from '../../styles';

export const StyledTable = styled(Paper)`
  margin: 0 auto;
  width: 100%;

  @media only screen and (min-width: ${breakpoints.SM}) {
    max-width: 35rem;
  }

  .MuiButton-root {
    margin-top: 0.5rem;
  }

  .MuiTableBody-root {
    tr {
      &:hover {
        background-color: var(--primary-opacity);
      }

      .MuiTableCell-root {
        cursor: pointer;

        &.user-cell {
          display: flex;
          align-items: center;

          h6 {
            margin-left: 1rem;
          }
        }
      }

      td {
        padding: 0.75rem;

        h6 {
          font-size: 0.85rem;
        }
      }
    }
  }
`;
