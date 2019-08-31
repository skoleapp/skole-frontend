import { Layout } from "../organisms/Layout";
import "../index.css";
import { Title } from "../atoms";
import { Loginbox } from "../templates";

export default () => (
  <Layout title="skole | Login">
    <>
      <Title font="monospace" size={50}>
        Log in
      </Title>
      <Loginbox></Loginbox>
    </>
  </Layout>
);
