import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Header, Layout } from '../../../components';

// Navigate dynamic URLs like this
const User: React.FC = () => {
  const router = useRouter();

  const id1 = 1;
  const id2 = 2;

  return (
    <Layout title="User">
      <Header>User {router.query.id}</Header>
      {/* Link to other dynamic pages like this */}
      <Link href="/user/[id]" as={`/user/${id1}`}>
        <a>user 1</a>
      </Link>
      <Link href="/user/[id]" as={`/user/${id2}`}>
        <a>user 2</a>
      </Link>
    </Layout>
  );
};

export default User;
