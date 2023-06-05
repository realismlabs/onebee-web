import React, { useState, useEffect, FC } from "react";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import router from "next/router";
import Image from "next/image";
import Head from "next/head";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  CaretRight,
  CircleNotch,
  CheckCircle,
  Plus,
} from "@phosphor-icons/react";
import { Disclosure, Transition } from "@headlessui/react";
import LogoSnowflake from "@/components/LogoSnowflake";
import LogoBigQuery from "@/components/LogoBigQuery";
import LogoPostgres from "@/components/LogoPostgres";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import InvitePeopleDialog from "@/components/InvitePeopleDialog";

export default function AddDataSource() {
  const [isInvitePeopleDialogOpen, setIsInvitePeopleDialogOpen] =
    useState(false);

  const [customMessage, setCustomMessage] = useState(
    "Hi there, \n\nI'd like to use Dataland.io as an easy and fast way to browse data from our data warehouse. Can you help me set up a read-only data source? \n\nPlease click the link below to get started. Thanks!"
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
      router.push(`/workspace/${currentWorkspace.id}/data-source/snowflake`);
    } else if (source === "bigquery") {
      router.push(`/workspace/${currentWorkspace.id}/data-source/bigquery`);
    } else if (source === "postgres") {
      router.push(`/workspace/${currentWorkspace.id}/data-source/postgres`);
    }
  };

  const email = currentUser.email;
  const workspace_name = currentWorkspace.name;

  return (
    <>
      <Head>
        <title>{currentWorkspace.name} › New data source</title>
      </Head>
      <WorkspaceLayout>
        <div className="h-screen bg-slate-1">
          <div className="flex flex-row gap-2 items-center border-b border-slate-4 py-[12px] pl-[12px] pr-[12px] sticky top-0 bg-slate-1 h-[48px]">
            <div className="h-[24px] w-[24px] flex items-center justify-center">
              <Plus size={20} weight="bold" className="text-slate-10" />
            </div>
            <p className="text-slate-12 text-[13px]">Add data source</p>
          </div>
          <div className="flex flex-col justify-center items-center w-full pt-32">
            <div className="bg-slate-1 text-slate-12 text-center text-[22px] pb-4 flex flex-row">
              <p>Connect a data source</p>
            </div>
            <form className="flex flex-col gap-4 mt-4">
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
                emailTemplateLanguage={`Help ${currentUser.name} set up a read-only data source`}
                customInvitePeopleSubject={`Help ${currentUser.name} set up a data source on Dataland.io`}
                emailType="invite-teammate-data-source"
              />
              <Link href={`/workspace/${currentWorkspace.id}`}>
                <div className="text-slate-12 text-[14px] text-center w-full cursor-pointer">
                  Do this later
                </div>
              </Link>
            </form>
          </div>
        </div>
      </WorkspaceLayout>
      <Toaster
        theme="dark"
        expand
        visibleToasts={6}
        toastOptions={{
          style: {
            background: "var(--slate1)",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            borderColor: "var(--slate4)",
          },
        }}
      />
    </>
  );
}
