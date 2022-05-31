import { useState } from "react";

import { useAuth } from "../contexts/AuthContexts";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();

    await signIn({ email, password });
  }

  return (
    <div className={styles["login-page"]}>
      <div className={styles["form-wrapper"]}>
        <h1 className={styles.title}>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
