import "@/styles/globals.css";
import Head from "next/head";
import { dark } from "@clerk/themes";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  const publicPages = [
    "/forgot-password",
    "/login",
    "/sandbox",
    "/signup",
    "/",
  ];

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        baseTheme: dark,
      }}
    >
      <Head>
        <title>
          Dataland | Browse your data warehouse fast. Even billion-row scale.
        </title>
        <meta
          name="description"
          content="Dataland lets your whole team browse your data warehouse at billion-row scale. Connect Snowflake, BigQuery, Postgres in 1 min. Get started for free."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Dataland" />
        {/* following is used for Slack */}
        <meta
          property="og:description"
          content="Dataland lets your whole team browse your data warehouse at billion-row scale. Connect Snowflake, BigQuery, Postgres in 1 min. Get started for free."
        />
        <meta
          property="og:site_name"
          content="Dataland | Browse your data warehouse, fast"
        />
        <meta property="og:url" content="https://www.dataland.io" />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/dl_marketing_assets/dataland_og_image_v2.png"
        />
      </Head>
      {isPublicPage ? (
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      ) : (
        <>
          <QueryClientProvider client={queryClient}>
            <SignedIn>
              <Component {...pageProps} />
              <ReactQueryDevtools
                initialIsOpen={false}
                position={"bottom-right"}
              />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
              {/* <Component {...pageProps} /> */}
            </SignedOut>
          </QueryClientProvider>
        </>
      )}
    </ClerkProvider>
  );
}
