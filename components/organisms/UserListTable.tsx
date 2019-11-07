import {
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { PublicUser } from '../../interfaces';

interface Props {
  users: PublicUser[];
}

export const UserListTable: React.FC<Props> = ({ users }) => (
  <StyledUserListTable>
    <Paper>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Users</TableCell>
            <TableCell align="right">Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user: PublicUser, i: number) => (
            <Link href={`/user/${user.id}`} key={i}>
              <TableRow>
                <TableCell className="main-cell">
                  <Avatar src={`${process.env.STATIC_URL}${user.avatar}`} />
                  <Typography variant="subtitle1">{user.username}</Typography>
                </TableCell>
                <TableCell align="right">{user.points}</TableCell>
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </StyledUserListTable>
);

const StyledUserListTable = styled.div`
  tr:hover {
    background-color: var(--light-opacity);
  }

  .main-cell {
    display: flex;
    align-items: center;

    h6 {
      margin-left: 1rem;
    }
  }
`;
