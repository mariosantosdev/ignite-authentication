import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { api } from "../services/api";

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
