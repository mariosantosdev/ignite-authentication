import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    api
      .get("/me")
      .then(({ data }) => console.log(data))
      .catch(console.error);
  });

  return <h1>Dashboard: {user?.email ?? ""}</h1>;
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const res = await apiClient.get("/me");

  console.log(res.data);

  return { props: {} };
});
