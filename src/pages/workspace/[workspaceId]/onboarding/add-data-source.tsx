import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import router from "next/router";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { X, CaretRight, CircleNotch, CheckCircle } from "@phosphor-icons/react";
import { Disclosure, Transition } from "@headlessui/react";
import LogoSnowflake from "@/components/LogoSnowflake";
import LogoBigQuery from "@/components/LogoBigQuery";
import LogoPostgres from "@/components/LogoPostgres";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { motion } from "framer-motion";
import InvitePeopleDialog from "@/components/InvitePeopleDialog";

interface AccountHeaderProps {
  email: string;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ email }) => {
  const handleLogout = () => {
    router.push("/login?lo=true");
  };

  return (
    <div className="w-full flex flex-row h-16 items-center p-12 bg-slate-1">
      <div className="flex flex-col grow items-start">
        <p className="text-[13px] text-slate-11 mb-1">Logged in as:</p>
        <p className="text-[13px] text-slate-12 font-medium">{email}</p>
      </div>
      <div className="flex flex-col grow items-end">
        <p
          className="text-[13px] text-slate-12 hover:text-slate-12 font-medium cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </p>
      </div>
    </div>
  );
};

export default function AddDataSource() {
  const [isInvitePeopleDialogOpen, setIsInvitePeopleDialogOpen] =
    useState(false);

  const [customMessage, setCustomMessage] = useState(
    "Hi there, \n\nI'd like to use Dataland.io as an easy and fast way to browse data from our data warehouse. Can you help me set up a read-only data source connection? \n\nPlease click the link below to get started. Thanks!"
  );

  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();

  const {
    data: currentWorkspace,
    isLoading: isWorkspaceLoading,
    error: workspaceError,
  } = useCurrentWorkspace();

  if (isUserLoading || isWorkspaceLoading) {
    return <div className="h-screen bg-slate-1"></div>;
  }

  if (userError || workspaceError) {
    return (
      <div>
        Error: {JSON.stringify(userError)} {JSON.stringify(workspaceError)}
      </div>
    );
  }

  const handleSourceClick = (source: string) => {
    if (source === "snowflake") {
      router.push(`/workspace/${currentWorkspace.id}/onboarding/add-snowflake`);
    } else if (source === "bigquery") {
      router.push(`/workspace/${currentWorkspace.id}/onboarding/add-bigquery`);
    } else if (source === "postgres") {
      router.push(`/workspace/${currentWorkspace.id}/onboarding/add-postgres`);
    }
  };

  const email = currentUser.email;
  const workspace_name = currentWorkspace.name;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="h-screen bg-slate-1">
      <AccountHeader email={email ?? "placeholder@example.com"} />
      <motion.div
        className="flex flex-col justify-center items-center w-full pt-32"
        variants={container}
        initial="hidden"
        animate="show"
        transition={{ duration: 1 }}
      >
        <motion.div
          className="bg-slate-1 text-slate-12 text-center text-[22px] pb-4"
          variants={item}
        >
          Connect a data source
        </motion.div>
        <motion.form className="flex flex-col gap-4 mt-4" variants={item}>
          <div className="flex gap-4">
            <div
              className="bg-slate-3 text-slate-12 text-[14px] w-28 h-24 flex flex-col gap-3 items-center justify-center rounded-md border border-slate-6 hover:bg-slate-4 cursor-pointer"
              onClick={(e) => handleSourceClick("snowflake")}
            >
              <div className="h-[32px] w-[32px]">
                <LogoSnowflake />
              </div>
              <p>Snowflake</p>
            </div>
            <Link href="/welcome/add-bigquery">
              <div className="bg-slate-3 text-slate-12 text-[14px] w-28 h-24 flex flex-col gap-3 items-center justify-center rounded-md border border-slate-6 hover:bg-slate-4 cursor-pointer">
                <div className="h-[32px] w-[32px]">
                  <LogoBigQuery />
                </div>
                <p>BigQuery</p>
              </div>
            </Link>
            <Link href="/welcome/add-postgres">
              <div className="bg-slate-3 text-slate-12 text-[14px] w-28 h-24 flex flex-col gap-3 items-center justify-center rounded-md border border-slate-6 hover:bg-slate-4 cursor-pointer">
                <div className="h-[32px] w-[32px]">
                  <LogoPostgres />
                </div>
                <p>Postgres</p>
              </div>
            </Link>
          </div>
          {/* <InviteTeammateDialog email={email} workspace={workspace_name} /> */}
          <div
            className="text-[14px] text-center mx-16 cursor-pointer hover:text-slate-11 px-6 py-3 bg-slate-2 hover:bg-slate-3 rounded-md mt-16 focus:outline-none"
            tabIndex={-1}
            onClick={() => setIsInvitePeopleDialogOpen(true)}
          >
            <p className="text-slate-10">Don&apos;t have credentials?</p>
            <p className="text-slate-12">Invite a teammate to help →</p>
          </div>
          <InvitePeopleDialog
            isInvitePeopleDialogOpen={isInvitePeopleDialogOpen}
            setIsInvitePeopleDialogOpen={setIsInvitePeopleDialogOpen}
            currentUser={currentUser}
            currentWorkspace={currentWorkspace}
            customMessage={customMessage}
            setCustomMessage={setCustomMessage}
            emailTemplateLanguage={`Help ${currentUser.name} set up a read-only data source connection.`}
            customInvitePeopleSubject={`Help ${currentUser.name} set up a data connection on Dataland.io`}
          />
          <Link href={`/workspace/${currentWorkspace.id}`}>
            <div className="text-slate-12 text-[14px] text-center w-full cursor-pointer">
              Do this later
            </div>
          </Link>
        </motion.form>
      </motion.div>
    </div>
  );
}
