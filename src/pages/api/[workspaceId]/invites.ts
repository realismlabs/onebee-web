import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let workspaceId = null;

    if (typeof req.query.workspaceId === "string") {
      workspaceId = req.query.workspaceId;
    } else if (
      Array.isArray(req.query.workspaceId) &&
      typeof req.query.workspaceId[0] === "string"
    ) {
      workspaceId = req.query.workspaceId[0];
    } else {
      return res.status(400).json({ message: "Missing workspaceId" });
    }

    const { email } = req.body;

    if (!email || !workspaceId) {
      return res.status(400).json({ message: "Missing email or workspaceId" });
    }

    try {
      // Check if the user exists
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const userResponse = await fetch(api_url + `/users?email=${email}`);
      const users = await userResponse.json();
      const user = users[0];

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create the invite
      const invite = {
        userId: user.id,
        workspaceId: parseInt(workspaceId),
      };

      const createInviteResponse = await fetch(`${api_url}/invites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invite),
      });

      const createdInvite = await createInviteResponse.json();

      return res.status(201).json(createdInvite);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
