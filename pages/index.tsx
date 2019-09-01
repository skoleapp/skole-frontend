<<<<<<< HEAD
import { Layout } from "../organisms/Layout";
import { LandingPage } from "../templates";
import "../index.css";
import { Header, Flexbox, Button } from "../atoms";
import Link from "next/link";
=======
import React from 'react';
import { FlexBox, Header } from '../atoms';
import '../index.css';
import { Login } from '../organisms';
import { Layout } from '../organisms/Layout';
import { LandingPage } from '../templates';
>>>>>>> 0e9e7d8c7baa3dc8cae17f77a19c7f5684afb08c

const Index: React.SFC<{}> = () => (
  <Layout title="skole | ebin oppimisalusta">
<<<<<<< HEAD
    <>
      <Header>
        <Flexbox justifyContent="flex-start">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </Flexbox>
      </Header>
      <LandingPage />
    </>
=======
    <Header>
      <FlexBox justifyContent="flex-end">
        <Login />
      </FlexBox>
    </Header>
    <LandingPage />
>>>>>>> 0e9e7d8c7baa3dc8cae17f77a19c7f5684afb08c
  </Layout>
);

export default Index;
