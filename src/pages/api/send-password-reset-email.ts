import type { NextApiRequest, NextApiResponse } from "next";

// example  request body:
// curl -X POST \
//     -H "Content-Type: application/json" \
//     -d '{
//       "email": "arthur@dataland.io",
//       "password_reset_url": "dataland.io/reset-password/slkdjfslfd"
//     }' \
//     http://localhost:8080/

interface sendVerificationEmailData {
  email: string;
  password_reset_url: string;
}

const endpoint =
  "https://us-central1-dataland-demo-995df.cloudfunctions.net/send_password_reset_email";

async function sendVerificationEmail(requestBody: sendVerificationEmailData) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in send password reset email:", error.message);
    } else {
      console.error("Unknown error in send password reset email:", error);
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
