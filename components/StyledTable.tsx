import { Paper } from '@material-ui/core';
import styled from 'styled-components';

export const StyledTable = styled(Paper)`
  max-width: 35rem;
  margin: 0 auto;

  .MuiTableBody-root {
    tr {
      &:hover {
        background-color: var(--light-opacity);
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
