import type { NextApiRequest, NextApiResponse } from "next";

interface SnowflakeData {
  accountIdentifier: string;
  warehouse: string;
  basicAuthUsername: string;
  basicAuthPassword: string;
  keyPairAuthUsername: string;
  keyPairAuthPrivateKey: string;
  keyPairAuthPrivateKeyPassphrase: string;
  role: string;
}

const testConnectionEndpoint =
  "https://us-central1-dataland-demo-995df.cloudfunctions.net/dataland-1b-connection-testing/test-connection";

async function testConnection(requestBody: SnowflakeData) {
  try {
    console.log("testConnection requestBody:", requestBody);
    const response = await fetch(testConnectionEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in testConnection:", error.message);
    } else {
      console.error("Unknown error in testConnection:", error);
    }
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const data = await testConnection(req.body);
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
