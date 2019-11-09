import { Table } from '@material-ui/core';
import styled from 'styled-components';

export const StyledTable = styled(Table)`
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

        .school-type {
          font-size: 0.75rem;
          padding: 0 0.35rem;
          pointer-events: none;
          margin-top: 0.25rem;
        }
      }
    }
  }
`;
