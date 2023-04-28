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
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: customPersister }}
    >
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} position={"bottom-right"} />
    </PersistQueryClientProvider>
  );
}
