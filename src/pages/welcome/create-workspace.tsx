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

export default function CreateWorkspace() {
  const { getToken } = useAuth();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [workspaceName, setWorkspaceName] = React.useState("");
  const [domain, setDomain] = React.useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("clicked");
    if (workspaceName === "" || workspaceName === null) {
      setErrorMessage("Workspace name is required.");
    } else {
      // TODO: Create workspace and mock API call to create workspace + allow others to join from same domain (if enabled)
      console.log(
        "TODO: Create workspace and mock API call to create workspace + allow others to join from same domain (if enabled)"
      );
      console.log({
        workspaceName,
        allowOthersFromDomainChecked,
      });
      // TODO: Push to home of the new workspace

      let createWorkspaceRequestBody = {
        name: workspaceName,
        createdAt: new Date().toISOString(),
        creatorUserId: currentUser?.id,
        allowedDomains:
          isCommonEmailProvider(domain) ||
          allowOthersFromDomainChecked === false
            ? []
            : [{ domain: domain, createdBy: currentUser?.id }],
      };
      try {
        const jwt = await getToken({ template: "test" });
        console.log("Before creating workspace");
        const created_workspace_result = await createWorkspace(
          createWorkspaceRequestBody,
          jwt
        );
        console.log("After creating workspace");

        console.log("Created workspace", created_workspace_result);
        try {
          const createMembershipRequestBody = {
            userId: currentUser?.id,
            workspaceId: created_workspace_result?.id,
            createdAt: new Date().toISOString(),
            role: "admin", // since they're the creator
          };

          console.log("Creating membership", createMembershipRequestBody);
          const jwt = await getToken({ template: "test" });
          const created_membership_result = await createMembership(
            createMembershipRequestBody,
            jwt
          );

          console.log("Created membership", created_membership_result);

          router.push(
            `/workspace/${created_workspace_result.id}/onboarding/add-data-source`
          );
        } catch (e) {
          console.log("Couldn't create membership", e);
        }
      } catch (e) {
        console.log("Couldn't create workspace", e);
      }
    }
  };

  const [allowOthersFromDomainChecked, setAllowOthersFromDomainChecked] =
    useState(true);

  function handleAllowOthersFromDomainCheckboxChange() {
    setAllowOthersFromDomainChecked(!allowOthersFromDomainChecked);
  }

  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();

  useEffect(() => {
    if (currentUser?.email) {
      const email = currentUser.email;
      const domain = email.split("@")[1];

      if (isCommonEmailProvider(domain)) {
        setWorkspaceName("");
      } else {
        const domain_without_extension = email.split("@")[1].split(".")[0];
        let workspace_name_suggestion = domain_without_extension;
        if (typeof domain_without_extension === "string") {
          workspace_name_suggestion =
            domain_without_extension.charAt(0).toUpperCase() +
            domain_without_extension.slice(1);
        }
        setWorkspaceName(workspace_name_suggestion);
      }
      setDomain(domain);
    }
  }, [currentUser]);

  if (isUserLoading) {
    return <div className="h-screen bg-slate-1"></div>;
  }

  if (userError) {
    return <div>Error: {JSON.stringify(userError)}</div>;
  }

  const email = currentUser.email;

  return (
    <>
      <Head>
        <title>Dataland | Create workspace</title>
      </Head>
      <div className="h-screen bg-slate-1">
        <AccountHeader email={email ?? "placeholder@example.com"} />
        <div className="flex flex-col justify-center items-center w-full pt-12">
          <div className="bg-slate-1 text-slate-12 text-center text-[22px] pb-4">
            Name your workspace
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 w-[300px] mt-4"
          >
            <div className="relative">
              <input
                type={"text"}
                id="workspaceNameInput"
                value={workspaceName}
                onChange={(e) => {
                  setWorkspaceName(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="i.e. Acme organization"
                className={`w-full bg-slate-3 border text-slate-12 text-[14px] rounded-md px-3 py-2 placeholder-slate-9
              ${errorMessage !== "" ? "border-red-9" : "border-slate-6"} 
              focus:outline-none focus:ring-blue-600
              `}
              />

              {errorMessage && (
                <p className="text-red-9 text-[13px] mt-2">{errorMessage}</p>
              )}
            </div>
            {/* Check if common email provider. If not, provide option */}
            {!isCommonEmailProvider(email) && (
              <div className="flex items-start">
                <input
                  id="allowOthersFromDomain"
                  type="checkbox"
                  className="mt-0.5 w-[18px] h-[18px] text-blue-600 bg-slate-3 border-slate-6 rounded focus:ring-blue-500 focus:ring-1"
                  checked={allowOthersFromDomainChecked}
                  onChange={handleAllowOthersFromDomainCheckboxChange}
                />
                <label
                  htmlFor="allowOthersFromDomain"
                  className="ml-2 block text-slate-11 text-[14px]"
                >
                  Allow anyone with an{" "}
                  <span className="text-slate-12 font-medium">
                    {"@" + domain}
                  </span>{" "}
                  email to join this workspace
                </label>
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-slate-12 text-[14px] font-medium py-2 px-4 rounded-md mt-4"
            >
              Create workspace
            </button>
            <div className="text-blue-500 text-center text-[14px] mt-12">
              <Link href="/join-workspace">Join an existing workspace →</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
