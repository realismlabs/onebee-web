import React, { useState, useEffect } from "react";
import Link from "next/link";
import router from "next/router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { createWorkspace, createMembership } from "@/utils/api";
import { isCommonEmailProvider } from "@/utils/util";
import { AccountHeader } from "@/components/AccountHeader";
import { useAuth } from "@clerk/nextjs";
import Head from "next/head";
import ColumnPopover from "@/components/column_edit/ColumnPopover";
import ColumnPopoverTestGroup from "@/components/column_edit/ColumnPopoverTestGroup";

export default function ComponentStaging() {
  return (
    <>
      <Head>
        <title>Dataland | Playground</title>
      </Head>
      <div className="bg-slate-1 flex-col h-[4000px] overflow-auto">
        <div className="max-w-[1200px] pt-24 mx-auto bg-slate-1">
          <p className="text-white bg-slate-1">
            This page is used to test out new UI components.
          </p>
          <ColumnPopoverTestGroup />
        </div>
      </div>
    </>
  );
}
