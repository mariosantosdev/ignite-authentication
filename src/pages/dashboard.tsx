import Link from "next/link";
import { useEffect } from "react";
import { CanRender } from "../components/CanRender";
import { useAuth } from "../contexts/AuthContexts";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user, signOut } = useAuth();

  useEffect(() => {
    api
      .get("/me")
      .then(({ data }) => console.log(data))
      .catch(console.error);
  });

  return (
    <>
      <h1>Dashboard: {user?.email ?? ""}</h1>

      <CanRender roles={["administrator"]}>
        <h2>Metrics</h2>
      </CanRender>

      <p>
        <Link href="/metrics">
          <a>Access Metrics Page</a>
        </Link>
        <span>
          {" "}
          - The metrics page maybe will redirect you again to dashboard page, if
          you don't have right permissions!
        </span>
      </p>

      <button onClick={signOut}>Sign Out</button>

      <CanRender roles={["editor"]}>
        <h2>Posts</h2>
      </CanRender>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => ({ props: {} }));
