import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import router from "next/router";
import Image from "next/image";
import { X, CaretRight, CircleNotch, CheckCircle } from "@phosphor-icons/react";
import { Disclosure, Transition, Dialog } from "@headlessui/react";
import LogoSnowflake from "@/components/LogoSnowflake";
import LogoBigQuery from "@/components/LogoBigQuery";
import LogoPostgres from "@/components/LogoPostgres";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { motion } from "framer-motion";

interface ToastProps {
  message: string;
  duration: number;
}

const Toast: React.FC<ToastProps> = ({ message, duration }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="mt-12 pl-2 pr-4 py-2 text-[12px] bg-slate-4 text-slate-12 rounded-md shadow-lg z-50 flex flex-row gap-2 items-center">
      <CheckCircle size={20} weight="fill" className="text-green-500" />
      {message}
    </div>
  );
};

const InvitePeopleDialog = ({
  isInvitePeopleDialogOpen,
  setIsInvitePeopleDialogOpen,
  currentUser,
  currentWorkspace,
}: {
  isInvitePeopleDialogOpen: boolean;
  setIsInvitePeopleDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: any;
  currentWorkspace: any;
}) => {
  let sender_email = currentUser.email;

  const [emailAddresses, setEmailAddresses] = useState<string>("");
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>(
    "Hi there, \n\nWe're using Dataland.io as an easy and fast way to browse data from our data warehouse. \n\nJoin the workspace in order to browse and search our key datasets."
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleEmailAddressChange = (e: any) => {
    setEmailAddresses(e.target.value);
    setErrorMessage("");
    setIsValid(true);
  };

  const createInvite = async (
    workspaceId: number,
    inviter_email: string,
    recipient_email: string
  ) => {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(
        `${api_url}/api/workspaces/${workspaceId}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inviter_email,
            recipient_email,
            accepted: false,
            workspaceId: workspaceId,
          }),
        }
      );

      if (response.ok) {
        const invite = await response.json();
        console.log("Invite created:", invite);
      } else {
        const error = await response.json();
        console.error("Error creating invite:", error.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (emailAddresses === "") {
      setIsValid(false);
      setErrorMessage("Email address is required.");
    } else {
      const regex =
        /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]+(,\s*[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]+)*$/;
      const regex_result = regex.test(emailAddresses);
      setIsValid(regex_result);
      if (regex_result === false) {
        setErrorMessage(
          "Error: Invalid email format. Please check your input, then try again."
        );
        return false;
      }
      if (regex_result === true) {
        setLoading(true);
        setShowToast(false);

        const delay = new Promise<void>((resolve) => setTimeout(resolve, 2000));

        // count the number of elements in csv string emailAddresses
        const emailAddressesArray = emailAddresses.split(",");
        const emailAddressesCount = emailAddressesArray.length;
        const inviteResultMessage = `Invited ${emailAddressesCount} ${
          emailAddressesCount === 1 ? "teammate" : "teammates"
        }!`;

        console.log("hello");

        const inviteAllTeammates = async () => {
          console.log("emailAddressesArray: ", emailAddressesArray);
          const workspaceId = 1;
          for (const recipient_email of emailAddressesArray) {
            console.log("starting to invite: ", recipient_email);
            await createInvite(workspaceId, sender_email, recipient_email);
          }
        };

        Promise.all([inviteAllTeammates(), delay]).then(() => {
          setLoading(false);
          setIsInvitePeopleDialogOpen(false);
          setToastMessage(inviteResultMessage);
          setShowToast(true);
        });
      }
    }
  };

  //  wait, timeout for validateEmailAddresses

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
    let sender_email_name = sender_email.split("@")[0];
    sender_email_name =
      sender_email_name.charAt(0).toUpperCase() +
      sender_email_name.slice(1).toLowerCase();

    return (
      <div className="mt-4 h-[280px] overflow-y-scroll p-4 bg-white text-black rounded-md text-[13px] space-y-2">
        <div className="text-slate-10 pb-1">
          <p>From: Dataland Support &lt;no-reply@dataland.io&gt;</p>
          <p>Subject: Help {sender_email_name} add a data source to Dataland</p>
          {/* dashed border */}
          <div className="border border-dashed border-slate-11 my-2"></div>
        </div>
        <div className="p-1.5 rounded-md bg-[#E7E5FF] w-8 h-8 items-center justify-center flex">
          <Image
            src="/images/logo-icon-only.png"
            width="30"
            height="20"
            alt="Dataland"
          />
        </div>
        <p>Hi there,</p>
        <p>
          {sender_email_name}{" "}
          <span className="font-semibold">({sender_email})</span> invited you to
          join the <span className="font-semibold">{workspace}</span> workspace
          on Dataland. Dataland makes it easy for your whole team to browse data
          from your data warehouse.
        </p>
        <p>They wrote you a note:</p>
        <div className="pl-4 py-2 border-l border-slate-12 italic">
          <p>{message}</p>
        </div>
        <button className="bg-blue-600 px-3 py-1.5 rounded-md text-slate-12 font-medium pointer-events-none">
          Accept invite
        </button>
        <p>You can also copy + paste this link into your browser:</p>
        <Link
          href="https://dataland.io"
          className="text-blue-500 underline mb-2"
        >
          dataland.io/join-workspace/workspace-id
        </Link>
        <hr className="pb-2" />
        <Link href="https://dataland.io">
          Dataland.io: the ultimate data browser
        </Link>
      </div>
    );
  };

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      <Dialog
        open={isInvitePeopleDialogOpen}
        onClose={() => setIsInvitePeopleDialogOpen(false)}
        className="absolute inset-0 flex min-w-full h-screen"
      >
        <Dialog.Overlay className="z-20 bg-slate-1 opacity-[90%] fixed inset-0" />
        <div className="fixed inset-0 flex items-start justify-center z-30">
          <Dialog.Panel className="fixed mx-auto max-h-[85vh] top-[60px] max-w-[90vw] w-[480px] rounded-[6px] bg-slate-2 border border-slate-3 text-slate-12 p-5 focus:outline-none overflow-hidden">
            <Dialog.Title className="m-0 text-[14px] font-medium">
              Invite people to {currentWorkspace.name}
            </Dialog.Title>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col flex-grow gap-1">
                    <label className="text-[14px] w-[120px]">
                      Email address(es)
                    </label>
                    <input
                      className={`rounded-md block w-full bg-slate-3 text-slate-12 text-[13px] py-2 px-3 border focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10
                    ${
                      isValid === false
                        ? "border-red-500"
                        : "border-slate-6 hover:border-slate-7"
                    }`}
                      required
                      value={emailAddresses}
                      onChange={(e) => handleEmailAddressChange(e)}
                      placeholder="teammate@example.com, teammate2@example.com"
                    />
                    {errorMessage !== "" ? (
                      <p className="text-[11px] text-red-500">{errorMessage}</p>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] w-[120px]">Message</label>
                    <textarea
                      className="flex-grow rounded-md block bg-slate-3 text-slate-12 text-[13px] py-2 px-3 h-48 min-h-[64px] border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10 leading-normal"
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
                        <Disclosure.Button
                          className="flex w-full rounded-sm text-left text-[12px] text-slate-12 gap-1 items-center"
                          tabIndex={-1}
                        >
                          <CaretRight
                            size={12}
                            weight="fill"
                            className={`${
                              open ? "rotate-90 transform" : ""
                            } text-slate-12`}
                          />
                          <span className="text-[14px]">
                            Toggle email preview
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel className="">
                          <EmailPreview
                            sender_email={sender_email}
                            workspace={currentWorkspace.name}
                            message={customMessage}
                          />
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  className="px-4 h-[36px] bg-slate-3 rounded-md text-[13px] font-medium leading-none focus:outline-none hover:bg-slate-4"
                  onClick={() => setIsInvitePeopleDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 h-[36px] bg-blue-600 rounded-md text-[13px] font-medium leading-none focus:outline-none w-[105px]
                  ${loading ? "opacity-50" : "hover:bg-blue-700"}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="relative inline-block">
                      <div className="animate-spin">
                        <CircleNotch width={16} height={16} />
                      </div>
                    </div>
                  ) : (
                    "Send invite"
                  )}
                </button>
              </div>
            </form>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
              onClick={() => setIsInvitePeopleDialogOpen(false)}
            >
              <X size={16} weight="bold" />
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Transition
        show={showToast}
        enter="transition-all ease-in-out duration-300"
        enterFrom="opacity-0 -translate-y-5"
        enterTo="opacity-100 translate-y-0"
        className="fixed top-0 left-1/2 -translate-x-1/2"
      >
        <div className=" text-slate-12 rounded-md shadow-lg transform -translate-y-25 transition-transform">
          <Toast
            message={toastMessage}
            duration={3000} // Duration of the Toast in milliseconds
          />
        </div>
      </Transition>
    </>
  );
};

export default InvitePeopleDialog;
