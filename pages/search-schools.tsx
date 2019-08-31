import { Layout } from "../organisms/Layout";
import { ListSchools } from "../templates";
import "../index.css";
import { Header, Flexbox } from "../atoms";
import { Login } from "../organisms";

export default () => (
  <Layout title="skole | ebin oppimisalusta">
    <>
      <Header>
        <Flexbox justifyContent="flex-end">
          <Login />
        </Flexbox>
      </Header>
      <ListSchools />
    </>
  </Layout>
);
