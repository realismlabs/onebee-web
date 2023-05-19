import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser, getUserMemberships } from "./utils/api";

export default authMiddleware({
  publicRoutes: [
    "/forgot-password",
    "/login",
    "/sandbox",
    "/signup",
    "/reset-password",
    "/",
  ],
  async afterAuth(auth, req, evt) {
    console.log("awu middleware auth req.url", req.url);
    if (req.url.includes("login")) {
      return NextResponse.next();
    }
    // This redirects the user to the login page if they are not logged in, but only if
    // they are not on a workspace/ page. This allows us to show different content for the workspace in _app.tsx
    if (
      !auth.userId &&
      !auth.isPublicRoute &&
      !req.url.includes("workspace/") &&
      !req.url.includes("login") // this is to prevent infinite redirect loop
    ) {
      const signInUrl = new URL("/login", process.env.NEXT_PUBLIC_APP_URL);
      return NextResponse.redirect(signInUrl);
    }
    // This redirects the user to the workspace no access page, which would happen if a new user
    // tries to access a table link (i.e. a new user going to /workspace/1/tables/1)
    if (
      !auth.userId &&
      !auth.isPublicRoute &&
      req.url.includes("workspace/") &&
      !req.url.includes("no-access")
    ) {
      const after_base_url = req.url.split("workspace/")[1];
      const workspaceId = after_base_url.split("/")[0];
      const notLoggedInUrl = new URL(
        `/workspace/${workspaceId}/no-access`,
        process.env.NEXT_PUBLIC_APP_URL
      );
      return NextResponse.redirect(notLoggedInUrl);
    }
    // If the user is logged in, but they don't have access to the workspace, redirect them to the no access page
    if (
      auth.userId &&
      !auth.isPublicRoute &&
      req.url.includes("workspace/") &&
      !req.url.includes("no-access")
    ) {
      const currentUser = await fetchCurrentUser(auth.userId);
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
          console.log("do nothing");
          // return NextResponse.redirect(req.url);
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
