/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, FC, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import router, { useRouter } from "next/router";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import {
  deleteWorkspace,
  updateWorkspace,
  getWorkspaceMemberships,
  getUser,
} from "@/utils/api";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import { X } from "@phosphor-icons/react";
import { Dialog } from "@headlessui/react";
import { friendlyRelativeDateToNow } from "@/utils/util";
import { useDropzone } from "react-dropzone";
import { useAuth } from "@clerk/nextjs";
import { useClerk } from "@clerk/clerk-react";

const ImageUploader = ({
  iconUrl,
  customWorkspaceBase64Icon,
  currentWorkspace,
  base64URL,
  setBase64URL,
  hasDroppedNewIcon,
  setHasDroppedNewIcon,
}: {
  iconUrl: string;
  customWorkspaceBase64Icon: string | null;
  currentWorkspace: any;
  base64URL: string | null;
  setBase64URL: React.Dispatch<React.SetStateAction<string | null>>;
  hasDroppedNewIcon: boolean;
  setHasDroppedNewIcon: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUserHoveringOverDropzone, setIsUserHoveringOverDropzone] =
    useState(false);

  // shows the customWorkspaceBase64Icon if it exists, otherwise shows the standard default iconUrl
  useEffect(() => {
    if (customWorkspaceBase64Icon) {
      setBase64URL(customWorkspaceBase64Icon);
    } else {
      setBase64URL(iconUrl);
    }
  }, [customWorkspaceBase64Icon, iconUrl, setBase64URL]);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      setError(null); // reset the error

      const file = acceptedFiles[0];
      const MAX_SIZE = 1 * 1024 * 1024; // 1MB
      const VALID_TYPES = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/svg+xml",
      ];

      if (file && VALID_TYPES.indexOf(file.type) === -1) {
        console.log("file.type", file.type);
        setError("Invalid file type. Please select an image file.");
      } else if (file && file.size > MAX_SIZE) {
        setError("File size exceeds 1MB. Please select another image.");
      } else if (file) {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {
          setBase64URL(reader.result as string);
          setFile(file);
          setHasDroppedNewIcon(true);
        };

        reader.onerror = () => {
          setError("Something went wrong! Please try again.");
        };
      }
    },
    [setBase64URL]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div className="">
      <div {...getRootProps()} className="w-[128px] h-[128px] relative">
        <input {...getInputProps()} accept="image/*" className="absolute" />
        {base64URL && (
          <div
            className="absolute rounded-lg overflow-clip flex items-center justify-center h-full w-full"
            onMouseEnter={() => setIsUserHoveringOverDropzone(true)}
            onMouseLeave={() => setIsUserHoveringOverDropzone(false)}
          >
            {(isUserHoveringOverDropzone || isDragActive) && (
              <div className="absolute w-full h-full z-20 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                Upload
              </div>
            )}
            {!customWorkspaceBase64Icon && hasDroppedNewIcon == false && (
              <p className="absolute text-white text-[36px]">
                {currentWorkspace?.name?.slice(0, 1)}
              </p>
            )}

            <img
              src={base64URL}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      <div className="text-slate-11 text-[13px] mt-3">
        Recommended icon size is 256 x 256
      </div>
      {error && <div className="text-red-9 text-[13px] mt-1">{error}</div>}
    </div>
  );
};

export default function Settings() {
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const handleRenameWorkspace = async (e: any) => {
    e.preventDefault();
    console.log("clicked");
    if (workspaceName === "" || workspaceName === null) {
      setErrorMessage("Workspace name is required.");
    } else {
      // TODO: Create workspace and mock API call to create workspace + allow others to join from same domain (if enabled)
      console.log("TODO: Rename workspace and mock API call");

      interface WorkspaceData {
        name: string;
        customWorkspaceBase64Icon?: string;
      }

      const workspaceData: WorkspaceData = {
        name: workspaceName ?? "",
      };

      if (hasDroppedNewIcon && base64URL) {
        workspaceData.customWorkspaceBase64Icon = base64URL;
      }

      try {
        const jwt = await getToken({ template: "test" });
        const response = await updateWorkspaceMutation.mutateAsync({
          workspaceId: currentWorkspace.id,
          workspaceData: workspaceData,
          jwt,
        });
      } catch (error) {
        console.error("Error updating workspace:", error);
      }
    }
  };

  const handleDeleteWorkspace = async () => {
    if (deleteWorkspaceName !== currentWorkspace.name) {
      setDeleteWorkspaceErrorMessage("Workspace name does not match.");
      return;
    }
    try {
      const jwt = await getToken({ template: "test" });
      const response = await deleteWorkspaceMutation.mutateAsync({
        workspaceId: currentWorkspace.id,
        jwt,
      });
      closeDeleteWorkspaceDialog();
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  const [isDeleteWorkspaceDialogOpen, setIsDeleteWorkspaceDialogOpen] =
    useState(false);
  const [deleteWorkspaceErrorMessage, setDeleteWorkspaceErrorMessage] =
    useState("");
  const [deleteWorkspaceName, setDeleteWorkspaceName] = useState("");
  const [base64URL, setBase64URL] = useState<string | null>(null);
  const [hasDroppedNewIcon, setHasDroppedNewIcon] = useState(false);

  const openDeleteWorkspaceDialog = () => {
    setIsDeleteWorkspaceDialogOpen(true);
  };

  const closeDeleteWorkspaceDialog = () => {
    setIsDeleteWorkspaceDialogOpen(false);
  };

  const queryClient = useQueryClient();

  const updateWorkspaceMutation = useMutation(updateWorkspace, {
    onSuccess: async (updatedWorkspace) => {
      await queryClient.refetchQueries([
        "currentWorkspace",
        currentWorkspace?.id,
      ]);
    },
    onError: (error) => {
      console.error("Error updating workspace", error);
    },
  });

  const deleteWorkspaceMutation = useMutation(deleteWorkspace, {
    onSuccess: async (deletedWorkspace) => {
      await queryClient.refetchQueries([
        "currentWorkspace",
        currentWorkspace?.id,
      ]);

      // awu: Log the user out (I don't want to giga-brain / confuse the user by switching to a random workspace. This step forces users to select a new workspace)
      await signOut();
    },
    onError: (error) => {
      console.error("Error updating workspace", error);
    },
  });

  // get router path - foramt is /workspace/6/settings/members, need to grab everything after /settings/
  const router = useRouter();
  const routerPath = router.asPath;

  const [errorMessage, setErrorMessage] = React.useState("");
  const [workspaceName, setWorkspaceName] = useState<string>();
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

  const {
    data: membershipsData,
    isLoading: isMembershipsLoading,
    error: membershipsError,
  } = useQuery({
    queryKey: ["getWorkspaceMemberships", currentWorkspace?.id],
    queryFn: async () => {
      const jwt = await getToken({ template: "test" });
      const response = await getWorkspaceMemberships(currentWorkspace?.id, jwt);
      return response;
    },
    enabled: currentWorkspace?.id !== null,
  });

  //  fetch user data for each membership
  const usersData = useQueries({
    queries: (membershipsData ?? []).map((membership: any) => {
      return {
        queryKey: ["getUser", membership.userId],
        queryFn: async () => {
          const jwt = await getToken({ template: "test" });
          const response = await getUser(membership.userId, jwt);
          return response;
        },
        enabled: membership.userId !== null,
      };
    }),
  });

  const currentUserMembership = membershipsData?.find(
    (membership: any) => membership.userId === currentUser?.id
  );

  useEffect(() => {
    if (currentWorkspace?.name) {
      setWorkspaceName(currentWorkspace?.name);
    }
  }, [currentWorkspace]);

  if (isUserLoading || isWorkspaceLoading || isMembershipsLoading) {
    return <div className="h-screen bg-slate-1"></div>;
  }

  if (userError || workspaceError || membershipsError) {
    return <div>Error: {JSON.stringify(userError)}</div>;
  }

  const email = currentUser.email;

  return (
    <>
      <Head>
        <title>{currentWorkspace.name} › General</title>
      </Head>
      <WorkspaceLayout>
        <div className="h-screen bg-slate-1 overflow-y-auto">
          <div className="flex flex-col justify-center items-center w-full pt-16">
            <div className="bg-slate-1 text-slate-12 text-left flex flex-col items-start text-[22px] pb-4 w-[1000px] gap-4 mr-[-24px]">
              <div className="flex flex-row gap-[100px] w-full">
                <div className="flex flex-col">
                  <div className="flex flex-col w-[120px] gap-8">
                    <div className="flex flex-col w-[120px] gap-8">
                      <div className="flex flex-col gap-0">
                        <div className="px-[12px] items-start text-left text-[16px] pb-[16px] w-full">
                          Settings
                        </div>
                        <div className="text-slate-11 text-[12px] tracking-wide py-[4px] px-[12px]">
                          Workspace
                        </div>
                        <Link
                          href={`/workspace/${currentWorkspace?.id}/settings/general`}
                        >
                          <div
                            className={`text-slate-12 text-[13px] hover:bg-slate-3 py-[4px] px-[12px] rounded-md 
                    ${routerPath.includes("general") ? "bg-slate-3" : ""}`}
                          >
                            General
                          </div>
                        </Link>
                        <Link
                          href={`/workspace/${currentWorkspace?.id}/settings/members`}
                        >
                          <div
                            className={`text-slate-12 text-[13px] hover:bg-slate-3 py-[4px] px-[12px] rounded-md 
                    ${routerPath.includes("members") ? "bg-slate-3" : ""}`}
                          >
                            Members
                          </div>
                        </Link>
                      </div>
                      <div className="flex flex-col gap-0">
                        <div className="text-slate-11 text-[12px] tracking-wide py-[4px] px-[12px]">
                          Account
                        </div>
                        <Link
                          href={`/workspace/${currentWorkspace?.id}/settings/profile`}
                        >
                          <div
                            className={`text-slate-12 text-[13px] hover:bg-slate-3 py-[4px] px-[12px] rounded-md 
                    ${routerPath.includes("profile") ? "bg-slate-3" : ""}`}
                          >
                            Profile
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col grow">
                  <div className="items-start text-left text-[16px] pb-[16px] border-b border-slate-4 w-full">
                    Manage workspace
                  </div>
                  {currentUserMembership?.role == "admin" && (
                    <div className="flex flex-col text-[14px] mt-[16px]">
                      <div className="flex flex-col">
                        <form
                          onSubmit={handleRenameWorkspace}
                          className="flex flex-col gap-4"
                        >
                          <div className="flex flex-col gap-2">
                            <label className="text-[14px] w-[120px]">
                              Icon
                            </label>
                            <ImageUploader
                              iconUrl={currentWorkspace?.iconUrl}
                              customWorkspaceBase64Icon={
                                currentWorkspace?.customWorkspaceBase64Icon ??
                                null
                              }
                              currentWorkspace={currentWorkspace}
                              base64URL={base64URL}
                              setBase64URL={setBase64URL}
                              hasDroppedNewIcon={hasDroppedNewIcon}
                              setHasDroppedNewIcon={setHasDroppedNewIcon}
                            />
                            <label className="text-[14px] w-[120px] mt-4">
                              Workspace name
                            </label>
                            <input
                              type={"text"}
                              id="workspaceNameInput"
                              value={workspaceName}
                              onChange={(e) => {
                                setWorkspaceName(e.target.value);
                                setErrorMessage("");
                              }}
                              placeholder="i.e. Acme organization"
                              className={`bg-slate-3 border text-slate-12 text-[14px] rounded-md px-3 py-2 placeholder-slate-9 w-[240px]
                                  ${
                                    errorMessage !== ""
                                      ? "border-red-9"
                                      : "border-slate-6"
                                  }
                                  focus:outline-none focus:ring-blue-600
                                  `}
                            />
                          </div>
                          {errorMessage && (
                            <p className="text-red-9 text-[13px] mt-3">
                              {errorMessage}
                            </p>
                          )}
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-slate-12 text-[14px] font-medium py-2 px-4 rounded-md self-start"
                          >
                            Save
                          </button>
                        </form>
                        <div className="flex flex-col gap-2 mt-12 w-[360px]">
                          <label className="text-[14px] w-[120px]">
                            Delete workspace
                          </label>
                          <p className="text-slate-11 text-[13px]">
                            Deleting a workspace is permanent. All imported
                            tables and connections will be deleted. This action
                            is irreversible.
                          </p>
                          <button
                            type="submit"
                            className="bg-red-5 hover:bg-red-6 border-red-7 border text-slate-12 text-[14px] font-medium py-2 px-4 rounded-md self-start mt-2"
                            onClick={openDeleteWorkspaceDialog}
                          >
                            Delete
                          </button>
                        </div>
                        <Dialog
                          as="div"
                          open={isDeleteWorkspaceDialogOpen}
                          onClose={() => setIsDeleteWorkspaceDialogOpen(false)}
                          className="absolute inset-0 flex min-w-full h-screen"
                        >
                          <Dialog.Overlay>
                            <div className="fixed inset-0 bg-slate-1 opacity-50" />
                          </Dialog.Overlay>
                          <Dialog.Panel className="absolute z-30 top-[25%] left-[50%] translate-x-[-50%] translate-y-[-25%] w-[400px]">
                            <div className="flex flex-col bg-slate-2 border border-slate-4 rounded-[8px] w-full p-[24px] text-slate-12">
                              {/* Close */}
                              <div className="rounded-[4px] text-[13px] absolute right-[16px] top-[16px] z-40">
                                <button
                                  onClick={() => {
                                    closeDeleteWorkspaceDialog();
                                  }}
                                  className="text-slate-11 hover:bg-slate-4 rounded-md h-[24px] w-[24px] ml-[12px] flex items-center justify-center"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                              <Dialog.Title className="text-[14px]">
                                Delete workspace
                              </Dialog.Title>
                              <Dialog.Description className="text-[13px] mt-[16px] gap-2 flex flex-col text-slate-11">
                                <div>
                                  Are you sure you want to delete this
                                  workspace? This will also delete all of this
                                  workspace&apos;s imported tables, connections,
                                  and members.{" "}
                                  <span className="font-semibold text-red-9">
                                    This action is irreversible.
                                  </span>
                                </div>
                              </Dialog.Description>
                              {/* to proceed, user needs to type the name of the workspace */}
                              <div className="flex flex-col mt-[16px] gap-2">
                                <label className="text-[13px]">
                                  Input the name of the workspace (
                                  {workspaceName}) to confirm
                                </label>
                                <input
                                  type={"text"}
                                  id="workspaceNameInput"
                                  value={deleteWorkspaceName}
                                  onChange={(e) => {
                                    setDeleteWorkspaceName(e.target.value);
                                  }}
                                  className={`bg-slate-3 border text-slate-12 text-[14px] rounded-md px-3 py-2 placeholder-slate-9 w-full
                                  ${
                                    deleteWorkspaceErrorMessage !== ""
                                      ? "border-red-9"
                                      : "border-slate-6"
                                  }
                                  focus:outline-none focus:ring-blue-600
                                  `}
                                />
                                {deleteWorkspaceErrorMessage && (
                                  <div className="text-red-9 text-[13px]">
                                    {deleteWorkspaceErrorMessage}
                                  </div>
                                )}
                              </div>
                              <div className="flex w-full justify-end mt-[24px] gap-2">
                                <button
                                  className="ml-auto bg-slate-3 hover:bg-slate-4 text-[13px] text-slate-12 px-[12px] py-[4px] rounded-[4px]"
                                  onClick={() => {
                                    closeDeleteWorkspaceDialog();
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="bg-red-5 hover:bg-red-6 border-red-7 border text-[13px] text-slate-12 px-[12px] py-[4px] rounded-[4px]"
                                  onClick={() => {
                                    handleDeleteWorkspace();
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </Dialog.Panel>
                        </Dialog>
                      </div>
                    </div>
                  )}
                  {currentUserMembership?.role !== "admin" && (
                    <div className="flex flex-col text-[14px] mt-[16px]">
                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] w-[120px] text-slate-11">
                          Icon
                        </label>
                        <div
                          className={`h-[96px] w-[96px] flex items-center justify-center text-[32px] rounded-md`}
                          style={{
                            backgroundImage: `url(${
                              currentWorkspace?.customWorkspaceBase64Icon
                                ? currentWorkspace?.customWorkspaceBase64Icon
                                : currentWorkspace?.iconUrl
                            })`,
                            backgroundSize: "cover",
                          }}
                        >
                          {!currentWorkspace?.customWorkspaceBase64Icon &&
                            currentWorkspace.name.slice(0, 1)}
                        </div>
                        <p className="text-[13px] text-slate-11 mt-4">
                          Workspace name
                        </p>
                        <p>{currentWorkspace.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </WorkspaceLayout>
    </>
  );
}
