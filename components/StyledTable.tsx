import { Table } from '@material-ui/core';
import styled from 'styled-components';

export const StyledTable = styled(Table)`
  tr:hover {
    background-color: var(--light-opacity);
  }

  .MuiTableCell-root {
    cursor: pointer;
  }

  .main-cell {
    display: flex;
    align-items: center;

    h6 {
      margin-left: 1rem;
    }
  }
`;
