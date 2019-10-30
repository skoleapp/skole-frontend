import React from 'react';
import { PublicUser } from '../../interfaces';

// interface Props {
//   users: PublicUser[];
// }

export const UserListTable: any = ({ users }: any) => {
  return users.map((user: PublicUser, idx: number) => <div key={idx}>{user.username}</div>);
};
