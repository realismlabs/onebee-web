import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { fetchCurrentUser, getUserMemberships, createUser } from "./utils/api";
import { capitalizeString } from "./utils/util";
import clerk from "@clerk/clerk-sdk-node";

// These logs show up in Vercel logs
export default authMiddleware({
  publicRoutes: ["/forgot-password", "/login", "/sandbox", "/signup", "/"],
  async afterAuth(auth, req, evt) {
    // console.log("auth", auth);
    const { getToken } = auth;
    const token = await getToken({ template: "test" });
    const auth_header = {
      Authorization: `Bearer ${token}`,
    };

    console.log("auth_header", auth_header);
    let currentUser = null;
    try {
      currentUser = await fetchCurrentUser(auth.userId, auth_header);
      console.log("currentUser", currentUser);
    } catch (error) {
      console.log("Error fetching current user:", error);
      // Respond with an error, don't leave the request hanging
      return NextResponse.error();
    }

    // if no currentUser exists in the Dataland db, but there is an authenticated user in Clerk, (
    // happens bc someone signs up via OAuth first), then create a user for them
    // and user is not visiting a public route
    if (!currentUser && auth.userId && !auth.isPublicRoute) {
      const clerkUser = await clerk.users.getUser(auth.userId);
      console.log("clerkUser", clerkUser);
      const emailAddress = clerkUser.emailAddresses[0].emailAddress;
      console.log("emailAddress", emailAddress);
      await createUser({
        email: emailAddress,
        name: capitalizeString(emailAddress.split("@")[0]),
        clerkUserId: auth.userId,
        jwt: token,
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
        const data = await getUserMemberships(currentUser.id, token);
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
