import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import { useUser } from "../../components/UserContext";
import router from "next/router";
import Image from "next/image";
import { useQueryClient, QueryClient, useQuery } from "react-query";

interface AccountHeaderProps {
  email: string;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ email }) => {
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    router.push("/login?lo=true");
  };

  return (
    <div className="w-full flex flex-row h-16 items-center p-12 bg-slate-1">
      <div className="flex flex-col grow items-start">
        <p className="text-xs text-slate-11 mb-1">Logged in as:</p>
        <p className="text-xs text-white font-medium">{email}</p>
      </div>
      <div className="flex flex-col grow items-end">
        <p
          className="text-xs text-white hover:text-slate-12 font-medium cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </p>
      </div>
    </div>
  );
};

interface FetchDatabasePreviewProps {
  queryClient: QueryClient;
}

const FetchDatabasePreview: React.FC<FetchDatabasePreviewProps> = ({
  queryClient,
}) => {
  const cachedData = queryClient.getQueryData("databasePreview");

  const { data, isLoading, isError, error } = useQuery(
    "databasePreview",
    async () => {
      // Replace this URL with the actual API endpoint to fetch the data
      const response = await fetch(
        "https://your-api-endpoint.com/database-preview"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    { enabled: !cachedData } // Disable the query if cachedData exists
  );

  React.useEffect(() => {
    if (data) {
      console.log("Fetched data from databasePreview:", data);
    }
  }, [data]);

  if (cachedData) {
    console.log("Using cached data:", cachedData);
    return (
      <div>
        <p>Database preview:</p>
        <pre className="text-white">{JSON.stringify(cachedData, null, 2)}</pre>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error!!</div>;
  }

  if (data) {
    return (
      <div>
        <p>Database preview:</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }

  return null;
};

export default function AddDataSource() {
  const { user } = useUser();
  const email = user?.email ?? "placeholder@example.com";

  const queryClient = useQueryClient();

  return (
    <div className="h-screen bg-slate-1">
      <AccountHeader email={email ?? "placeholder@example.com"} />
      <div className="flex flex-col justify-center items-center w-full pt-32">
        <div className="bg-slate-1 text-white text-center text-2xl pb-4"></div>
        <FetchDatabasePreview queryClient={queryClient} />
      </div>
    </div>
  );
}
