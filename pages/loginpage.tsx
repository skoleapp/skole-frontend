import { Layout } from "../organisms/Layout";
import "../index.css";
import { Signin, Signup } from "../templates";

export default () => (
  <Layout title="skole | Login">
    <>
      <Signin></Signin>
      <Signup></Signup>
    </>
  </Layout>
);
