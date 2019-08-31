import { Layout } from "../organisms/Layout";
import "../index.css";
import { Title } from "../atoms";

export default () => (
  <Layout title="skole | account">
    <Title font="monospace" size={100}>
      Hello user!
    </Title>
  </Layout>
);
