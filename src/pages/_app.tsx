import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  PersistQueryClientProvider,
  Persister,
  PersistedClient,
} from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { useRouter } from "next/router";

function getPersister(): Persister {
  if (typeof window !== "undefined") {
    return createSyncStoragePersister({
      storage: window.localStorage,
    });
  }
  return {
    persistClient: () => Promise.resolve(),
    restoreClient: () => Promise.resolve(undefined),
    removeClient: () => Promise.resolve(),
  };
}

const customPersister: Persister = {
  persistClient: (client) => getPersister().persistClient(client),
  restoreClient: (): Promise<PersistedClient | undefined> =>
    getPersister().restoreClient() as Promise<PersistedClient | undefined>,
  removeClient: () => getPersister().removeClient(),
};

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  const publicPages = [
    "/forgot-password",
    "/login",
    "/sandbox",
    "/signup",
    "/reset-password",
    "/",
  ];

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider {...pageProps}>
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: customPersister }}
          >
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
          </PersistQueryClientProvider>
        </>
      )}
    </ClerkProvider>
  );
}
