import { Layout } from "../organisms/Layout";
import { LandingPage } from "../templates";
import "../index.css";
import { Header, Flexbox, Button } from "../atoms";
import Link from "next/link";

export default () => (
  <Layout title="skole | ebin oppimisalusta">
    <>
      <Header>
        <Flexbox justifyContent="flex-start">
          <Link href="/loginpage">
            <Button>Login</Button>
          </Link>
        </Flexbox>
      </Header>
      <LandingPage />
    </>
  </Layout>
);
