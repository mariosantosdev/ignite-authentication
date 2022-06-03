import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useAuth();

  const userCanSeePosts = useCan({
    roles: ["editor"],
  });

  const userCanSeeMetrics = useCan({
    roles: ["administrator"],
  });

  useEffect(() => {
    api
      .get("/me")
      .then(({ data }) => console.log(data))
      .catch(console.error);
  });

  return (
    <>
      <h1>Dashboard: {user?.email ?? ""}</h1>
      {userCanSeeMetrics && <h2>Metrics</h2>}
      {userCanSeePosts && <h2>Posts</h2>}
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const res = await apiClient.get("/me");

  console.log(res.data);

  return { props: {} };
});
