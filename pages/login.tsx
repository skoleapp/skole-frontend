import { Layout } from "../organisms/Layout";
import "../index.css";
import { Signin, Signup } from "../templates";
import { register, authenticate } from "../redux/actions/authActions";

export default () => (
  <Layout title="skole | Login">
    <>
      <Signin authenticate={authenticate}></Signin>
      <Signup register={register}></Signup>
    </>
  </Layout>
);
