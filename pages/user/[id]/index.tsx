import Link from 'next/link';
import React from 'react';
import { MainLayout } from '../../../components';

// Navigate dynamic URLs like this
const User: React.FC = () => {
  // const router = useRouter();

  const id1 = 1;
  const id2 = 2;

  return (
    <MainLayout title="User">
      <Link href="/user/[id]" as={`/user/${id1}`}>
        <a>user 1</a>
      </Link>
      <Link href="/user/[id]" as={`/user/${id2}`}>
        <a>user 2</a>
      </Link>
    </MainLayout>
  );
};

export default User;
