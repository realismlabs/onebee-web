import { Toaster, toast } from "sonner";
import React, { useState, useEffect, FC, Fragment } from "react";
import Link from "next/link";
import router from "next/router";
import Image from "next/image";
import {
  X,
  CaretRight,
  CircleNotch,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";
import { Disclosure, Transition, Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { createInvite } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

const InvitePeopleDialog = ({
  isInvitePeopleDialogOpen,
  setIsInvitePeopleDialogOpen,
  currentUser,
  currentWorkspace,
  customMessage,
  setCustomMessage,
  emailTemplateLanguage,
  customInvitePeopleDialogHeader,
  customInvitePeopleSubject,
}: {
  isInvitePeopleDialogOpen: boolean;
  setIsInvitePeopleDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: any;
  currentWorkspace: any;
  customMessage: string;
  setCustomMessage: React.Dispatch<React.SetStateAction<string>>;
  emailTemplateLanguage: string;
  customInvitePeopleDialogHeader?: string;
  customInvitePeopleSubject?: string;
}) => {
  let inviterEmail = currentUser.email;
  const { getToken } = useAuth();

  const [emailAddresses, setEmailAddresses] = useState<string>("");
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleEmailAddressChange = (e: any) => {
    setEmailAddresses(e.target.value);
    setErrorMessage("");
    setIsValid(true);
  };

  const queryClient = useQueryClient();

  const inviteWorkspaceMemberMutation = useMutation(createInvite, {
    onSuccess: async (createdInvite) => {
      console.log("updatedWorkspace:", createdInvite);
      await queryClient.refetchQueries([
        "getWorkspaceInvites",
        currentWorkspace?.id,
      ]);
    },
    onError: (error) => {
      console.error("Error inviting workspace member:", error);
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = await getToken({ template: "test" });
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
        const delay = new Promise<void>((resolve) => setTimeout(resolve, 2000));

        // count the number of elements in csv string emailAddresses
        const emailAddressesArray = emailAddresses.split(",");
        const emailAddressesCount = emailAddressesArray.length;
        const inviteResultMessage = `Invited ${emailAddressesCount} ${
          emailAddressesCount === 1 ? "teammate" : "teammates"
        }!`;

        const inviteAllTeammates = async () => {
          console.log("emailAddressesArray: ", emailAddressesArray);
          let allSuccess = true; // flag to keep track if all invitations were successful
          for (const recipientEmail of emailAddressesArray) {
            console.log("starting to invite: ", recipientEmail);
            try {
              await inviteWorkspaceMemberMutation.mutateAsync({
                workspaceId: currentWorkspace.id,
                inviterEmail,
                recipientEmail,
                jwt: token,
              });
              toast(`Invited ${recipientEmail}!`, {
                icon: (
                  <CheckCircle
                    size={20}
                    weight="fill"
                    className="text-green-500"
                  />
                ),
              });
            } catch (err: any) {
              allSuccess = false; // update the flag to false when an error occurs
              if (err.message === "user_already_member") {
                toast(
                  `${recipientEmail} is already a member of this workspace.`,
                  {
                    icon: (
                      <XCircle
                        size={20}
                        weight="fill"
                        className="text-red-500 mt-1.5"
                      />
                    ),
                  }
                );
                // No need to throw the error as we want to continue with the loop
              } else if (err.message === "user_already_invited") {
                toast(
                  `Error: User with email ${recipientEmail} has already been invited`,
                  {
                    icon: (
                      <XCircle
                        size={20}
                        weight="fill"
                        className="text-red-500 mt-1.5"
                      />
                    ),
                  }
                );
              } else {
                toast(`Error: Unexpected error occurred`, {
                  icon: (
                    <XCircle size={20} weight="fill" className="text-red-500" />
                  ),
                  description: `Error removing invite + ${err}`,
                });
              }
            }
          }
          return allSuccess; // return the flag indicating the success status of all invitations
        };

        Promise.all([inviteAllTeammates()])
          .then(([allSuccess]) => {
            setLoading(false);
            setIsInvitePeopleDialogOpen(false);
          })
          .catch((err) => {
            // This catch block is for any errors that occur outside of the inviteAllTeammates function
            console.error(err);
            setLoading(false);
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
    emailTemplateLanguage,
  }: {
    sender_email: any;
    workspace: any;
    message: any;
    emailTemplateLanguage: string;
  }) => {
    let sender_email_name = sender_email.split("@")[0];
    sender_email_name =
      sender_email_name.charAt(0).toUpperCase() +
      sender_email_name.slice(1).toLowerCase();

    return (
      <div className="mt-4 h-[280px] overflow-y-scroll p-4 bg-white text-black rounded-md text-[13px] space-y-2">
        <div className="text-slate-10 pb-1">
          <p>From: Dataland Support &lt;no-reply@dataland.io&gt;</p>
          {customInvitePeopleSubject ? (
            <p>Subject: {customInvitePeopleSubject}</p>
          ) : (
            <p>
              Subject: {sender_email_name} invited you to{" "}
              {currentWorkspace.name} on Dataland.io
            </p>
          )}
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
        {emailTemplateLanguage !== "" && <p>{emailTemplateLanguage}</p>}
        <p>They wrote you a note:</p>
        <div className="pl-4 py-2 border-l border-slate-12 italic">
          <p>{message}</p>
        </div>
        <div className="bg-blue-600 px-3 py-1.5 rounded-md text-slate-12 font-medium pointer-events-none w-28 flex items-center justify-center">
          Accept invite
        </div>
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
              {customInvitePeopleDialogHeader
                ? customInvitePeopleDialogHeader
                : `Invite people to ${currentWorkspace.name}`}
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.preventDefault();
                      }}
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
                      className="flex-grow rounded-md block bg-slate-3 text-slate-12 text-[13px] py-2 px-3 h-36 min-h-[64px] border border-slate-6 hover:border-slate-7 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-10 leading-normal"
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
                            sender_email={inviterEmail}
                            workspace={currentWorkspace.name}
                            message={customMessage}
                            emailTemplateLanguage={emailTemplateLanguage}
                          />
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  className="px-4 h-[36px] bg-slate-3 rounded-md text-[13px] font-medium leading-none  hover:bg-slate-4"
                  onClick={() => setIsInvitePeopleDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 h-[36px] bg-blue-600 rounded-md text-[13px] font-medium leading-none  w-[105px]
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
      <div className="flex flex-row items-start bg-slate-9"></div>
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
};

export default InvitePeopleDialog;
