import { Provider } from "react-redux";
import "../styles/index.scss";
import Store from "../utils/Redux/Store";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Provider store={Store}>
        <Head>
          <title>Integra</title>
          <meta name="title" content="Integra" />
        </Head>
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}
