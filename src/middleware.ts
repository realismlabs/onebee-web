import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { fetchCurrentUser, getUserMemberships, createUser } from "./utils/api";
import { capitalizeString } from "./utils/util";
import clerk from "@clerk/clerk-sdk-node";

export default authMiddleware({
  publicRoutes: ["/forgot-password", "/login", "/sandbox", "/signup", "/"],
  async afterAuth(auth, req, evt) {
    const currentUser = await fetchCurrentUser(auth.userId);

    // if no currentUser exists in the Dataland db, but there is an authenticated user in Clerk, (happens bc someone signs up via OAuth first), then create a user for them
    if (!currentUser && auth.userId) {
      const clerkUser = await clerk.users.getUser(auth.userId);
      const emailAddress = clerkUser.emailAddresses[0].emailAddress;
      const created_user = await createUser({
        email: emailAddress,
        name: capitalizeString(emailAddress.split("@")[0]),
        clerkUserId: auth.userId,
      });
    }

    if (
      auth.userId &&
      !auth.isPublicRoute &&
      req.url.includes("workspace/") &&
      !req.url.includes("no-access")
    ) {
      // If the user is logged in, but they don't have access to the workspace, redirect them to the no access page
      if (currentUser && currentUser.id) {
        const data = await getUserMemberships(currentUser.id);
        const after_base_url = req.url.split("workspace/")[1];
        const workspaceId = after_base_url.split("/")[0];
        const userHasAccess = data.some(
          (membership: any) => membership.workspaceId === parseInt(workspaceId)
        );
        if (!userHasAccess) {
          const noAccessUrl = new URL(
            `/workspace/${workspaceId}/no-access`,
            process.env.NEXT_PUBLIC_APP_URL
          );
          return NextResponse.redirect(noAccessUrl);
        } else {
        }
      }
    }
    // print what's next
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
