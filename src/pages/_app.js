import { Provider } from "react-redux";
import "../styles/index.scss";
import Store from "../utils/Redux/Store";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Provider store={Store}>
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}
