import { Layout } from "../organisms/Layout";
import { LandingPage } from "../templates";
import "../index.css";
import { Header } from "../atoms";
import Flexbox from "flexbox-react";
import { Login } from "../organisms";

export default () => (
  <Layout title="skole | ebin oppimisalusta">
    <>
      <Header>
        <Flexbox justifyContent="flex-end">
          <Login />
        </Flexbox>
      </Header>
      <LandingPage />
    </>
  </Layout>
);
