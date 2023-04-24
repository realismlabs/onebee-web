import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import { useUser } from "../../components/UserContext";
import router from "next/router";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { X, CaretRight } from "@phosphor-icons/react";
import { Disclosure, Transition } from "@headlessui/react";

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
  const workspace_name = "My Workspace";

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
          <InviteTeammateDialog email={email} workspace={workspace_name} />
          <div className="text-white text-sm text-center w-full cursor-pointer">
            Do this later
          </div>
        </form>
      </div>
    </div>
  );
}

const InviteTeammateDialog = ({
  email,
  workspace,
}: {
  email: any;
  workspace: any;
}) => {
  let sender_email = email;
  let workspacee_name = workspace;
  console.log("sender_email", sender_email);
  const [emailAddresses, setEmailAddresses] = useState<string>("");
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>(
    "Hi there, \n\nI'd like to use Dataland.io as an easy and fast way to browse data from our data warehouse. Can you help me set up a read-only data source connection? \n\nPlease click the link below to get started. Thanks!"
  );

  const handleEmailAddressChange = (e: any) => {
    setEmailAddresses(e.target.value);
    setErrorMessage("");
    setIsValid(true);
  };
  const validateEmailAddresses = () => {
    if (emailAddresses === "") {
      setIsValid(false);
      setErrorMessage("Email address is required.");
    } else {
      const regex =
        /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]+(,\s*[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]+)*$/;
      setIsValid(regex.test(emailAddresses));
      console.log("isValid", isValid);
      if (isValid === false) {
        setErrorMessage(
          "Error: Invalid email format. Please check your input, then try again."
        );
      }
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("clicked");
    // call validateEmailAddresses
    validateEmailAddresses();
  };

  // define email preview
  const EmailPreview = ({
    sender_email,
    workspace,
    message,
  }: {
    sender_email: any;
    workspace: any;
    message: any;
  }) => {
    console.log("sender_email", sender_email);
    console.log("workspace", workspace);
    return (
      <div className="mt-4 h-48 overflow-y-scroll p-4 bg-white text-black rounded-md">
        <Image
          src="/images/logo-icon-only.png"
          width="42"
          height="38"
          alt="Dataland"
        />
        <h1>
          {sender_email} invited you to join them at Dataland workspace{" "}
          {workspace}
        </h1>
        <p>{message}</p>
        <button className="">Verify account</button>
        <p>You can also copy + paste this link into your browser:</p>
        <Link href="https://dataland.io"></Link>
        <hr />
        <Link href="https://dataland.io">
          Dataland.io: the ultimate data browser
        </Link>
      </div>
    );
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger tabIndex={-1}>
        <div className="text-sm text-center mx-16 cursor-pointer hover:text-slate-11 px-6 py-3 bg-slate-2 hover:bg-slate-3 rounded-md mt-16">
          <p className="text-slate-10">Don&apos;t have credentials?</p>
          <p className="text-white">Invite a teammate to help →</p>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal className="z-100">
        <Dialog.Overlay className="z-20 bg-slate-1 opacity-75 fixed inset-0" />
        <div className="fixed inset-0 flex items-start justify-center z-30">
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed mx-auto max-h-[85vh] top-24 max-w-[90vw] w-[480px] rounded-[6px] bg-slate-2 border border-slate-3 text-white p-5 focus:outline-none overflow-hidden">
            <Dialog.Title className="m-0 text-[14px] font-medium">
              Invite a teammate to help
            </Dialog.Title>
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col flex-grow gap-1">
                  <label className="text-xs w-[120px]">Email address(es)</label>
                  <p className="text-[11px] text-slate-11">
                    Enter multiple email addresses separated by commas.
                  </p>
                  <input
                    className={`rounded-md block w-full bg-slate-3 text-white text-xs py-2 px-3 border focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10
                    ${
                      isValid === false
                        ? "border-red-500"
                        : "border-slate-6 hover:border-slate-7"
                    }`}
                    required
                    value={emailAddresses}
                    onChange={(e) => handleEmailAddressChange(e)}
                    placeholder="teammate@example.com"
                  />
                  {errorMessage && (
                    <p className="text-[11px] text-red-500">{errorMessage}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs w-[120px]">Message</label>
                  <textarea
                    className="flex-grow rounded-md block bg-slate-3 text-white text-xs py-2 px-3 h-36 min-h-[64px] border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10"
                    required
                    title="Custom message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                  />
                </div>
              </div>
              {/* Toggle preview */}
              <div className="mx-auto w-full">
                <Disclosure as="div" className="mt-2">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full rounded-sm text-left text-[12px] text-white gap-1 items-center">
                        <CaretRight
                          size={12}
                          weight="fill"
                          className={`${
                            open ? "rotate-90 transform" : ""
                          } text-slate-12`}
                        />
                        <span>Toggle email preview</span>
                      </Disclosure.Button>
                      <Disclosure.Panel className="">
                        <EmailPreview
                          sender_email={sender_email}
                          workspace={workspace}
                          message={customMessage}
                        />
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Dialog.Close asChild>
                <button className="px-4 py-3 bg-slate-3 rounded-md text-xs font-medium leading-none focus:outline-none hover:bg-slate-4">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                className="px-4 py-3 bg-blue-600 rounded-md text-xs font-medium leading-none focus:outline-none hover:bg-blue-700"
                onClick={handleSubmit}
              >
                Send invite
              </button>
            </div>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
              onClick={handleSubmit}
            >
              <X size={16} weight="bold" />
            </button>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
