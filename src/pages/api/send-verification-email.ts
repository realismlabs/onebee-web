import type { NextApiRequest, NextApiResponse } from "next";

interface sendVerificationEmailData {
  email: string;
  verification_token: string;
}

const endpoint =
  "https://us-central1-dataland-demo-995df.cloudfunctions.net/send_verification_email";

async function sendVerificationEmail(requestBody: sendVerificationEmailData) {
  const email = requestBody.email;
  const verification_token = requestBody.verification_token;
  const app_url = process.env.NEXT_PUBLIC_APP_URL;
  const verification_url = `${app_url}/verify-email?token=${verification_token}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        verification_url,
      }),
    });

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in sendVerificationEmail:", error.message);
    } else {
      console.error("Unknown error in sendVerificationEmail:", error);
    }
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  console.log("hi", req);

  if (req.method === "POST") {
    try {
      const data = await sendVerificationEmail(req.body);
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in handler:", error.message);
        res.status(500).json({ error: error.message });
      } else {
        console.error("Unknown error in handler:", error);
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
