import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "../../components/UserContext";
import router from "next/router";

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

export default function CreateWorkspace() {
  const { user } = useUser();
  const email = user?.email ?? "placeholder@example.com";
  const domain = email?.split("@")[1];
  const domain_without_extension = email?.split("@")[1].split(".")[0];
  let workspace_name_suggestion = domain_without_extension;
  if (typeof domain_without_extension === "string") {
    workspace_name_suggestion =
      domain_without_extension.charAt(0).toUpperCase() +
      domain_without_extension.slice(1);
  }
  const [errorMessage, setErrorMessage] = React.useState("");
  const [workspaceName, setWorkspaceName] = React.useState(
    workspace_name_suggestion ?? null
  );
  const handleSubmit = (e: any) => {
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
      router.push("/welcome/add-data-source");
    }
  };

  const [allowOthersFromDomainChecked, setAllowOthersFromDomainChecked] =
    useState(true);

  function handleAllowOthersFromDomainCheckboxChange() {
    setAllowOthersFromDomainChecked(!allowOthersFromDomainChecked);
  }

  useEffect(() => {
    const inputElement = document.getElementById("workspaceNameInput");
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return (
    <div className="h-screen bg-slate-1">
      <AccountHeader email={email ?? "placeholder@example.com"} />
      <div className="flex flex-col justify-center items-center w-full pt-32">
        <div className="bg-slate-1 text-white text-center text-2xl pb-4">
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
              value={workspaceName ?? ""}
              onChange={(e) => {
                setWorkspaceName(e.target.value);
                setErrorMessage("");
              }}
              placeholder="i.e. Acme organization"
              className={`w-full bg-slate-3 border text-white text-sm rounded-md px-3 py-2 placeholder-slate-9
                          ${
                            errorMessage !== ""
                              ? "border-red-9"
                              : "border-slate-6"
                          } 
                          focus:outline-none focus:ring-blue-600
                          `}
            />
            {errorMessage && (
              <p className="text-red-9 text-xs mt-2">{errorMessage}</p>
            )}
          </div>
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
              className="ml-2 block text-slate-11 text-sm"
            >
              Allow anyone with an{" "}
              <span className="text-white font-medium">{"@" + domain}</span>{" "}
              email to join this workspace
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md mt-4"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
