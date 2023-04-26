import { useCurrentUser } from "../hooks/useCurrentUser";
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace";

export default function YourComponent() {
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

  // You can now use currentUser and currentWorkspace data in your component

  return (
    <div>
      Hello
      {JSON.stringify(currentUser)} {JSON.stringify(currentWorkspace)}
    </div>
  );
}
