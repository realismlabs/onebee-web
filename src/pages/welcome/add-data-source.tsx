import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import { useUser } from "../../components/UserContext";
import router from "next/router";
import Image from "next/image";

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

export default function AddDataSource() {
  const { user } = useUser();
  const email = user?.email ?? "placeholder@example.com";

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("clicked");
    // if (workspaceName === "" || workspaceName === null) {
    //   setErrorMessage("Workspace name is required.");
    // } else {
    //   router.push("/welcome/add-data-source");
    // }
  };

  const [allowOthersFromDomainChecked, setAllowOthersFromDomainChecked] =
    useState(true);

  function handleAllowOthersFromDomainCheckboxChange() {
    setAllowOthersFromDomainChecked(!allowOthersFromDomainChecked);
  }

  type ServiceCardProps = {
    logoSrc: string;
    serviceName: string;
    route: string;
  };

  const ServiceCard: FC<ServiceCardProps> = ({
    logoSrc,
    serviceName,
    route,
  }) => {
    return (
      <Link href={route}>
        <div className="bg-slate-3 text-white text-sm w-28 h-24 flex flex-col gap-3 items-center justify-center rounded-md border border-slate-6 hover:bg-slate-4 cursor-pointer">
          <Image
            className="pointer-events-none select-none"
            src={logoSrc}
            alt="Logo"
            draggable={false}
            width={32}
            height={32}
          />
          <p>{serviceName}</p>
        </div>
      </Link>
    );
  };

  return (
    <div className="h-screen bg-slate-1">
      <AccountHeader email={email ?? "placeholder@example.com"} />
      <div className="flex flex-col justify-center items-center w-full pt-32">
        <div className="bg-slate-1 text-white text-center text-2xl pb-4">
          Connect a data source
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="flex gap-4">
            <ServiceCard
              logoSrc="../../images/logos/logo_snowflake.svg"
              serviceName="Snowflake"
              route="/welcome/add-snowflake"
            />
            <ServiceCard
              logoSrc="../../images/logos/logo_bigquery.svg"
              serviceName="BigQuery"
              route="/welcome/add-bigquery"
            />
            <ServiceCard
              logoSrc="../../images/logos/logo_postgres.svg"
              serviceName="Postgres"
              route="/welcome/add-postgres"
            />
          </div>
          <div className="text-sm text-center mx-16 cursor-pointer hover:text-slate-11 px-6 py-3 bg-slate-2 hover:bg-slate-3 rounded-md mt-16">
            <p className="text-slate-10">Don&apos;t have credentials?</p>
            <p className="text-white">Invite a teammate to help →</p>
          </div>
          <div className="text-white text-sm text-center w-full cursor-pointer">
            Do this later
          </div>
        </form>
      </div>
    </div>
  );
}
