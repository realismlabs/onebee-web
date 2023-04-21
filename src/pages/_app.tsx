import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../components/UserContext";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./queryClient";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </QueryClientProvider>
  );
}
