import "../styles/globals.css";

import { AuthContextProvider } from "../contexts/AuthContexts";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp;
