import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface DatalandVerifyEmailProps {
  slug?: string | null;
  inviterName?: string | null;
  inviterEmail?: string | null;
  workspaceName?: string | null;
  customMessage?: string | null;
  workspaceLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const DatalandVerifyEmail = ({
  slug = null,
  inviterName = null,
  inviterEmail = null,
  workspaceName = null,
  customMessage = `Hi there, \n\nI'd like to use Dataland.io as an easy and fast way to browse data from our data warehouse. Can you help me set up a read-only data source? \n\nPlease click the link below to get started. Thanks!`,
  workspaceLink = `https://dataland.io/workspace/6`,
}: DatalandVerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {inviterName ?? "Someone"} invited you to join{" "}
      {workspaceName ?? "a workspace"} on Dataland.io
    </Preview>
    <Body style={main}>
      <Container style={container} align="left">
        <Img
          src={`https://storage.googleapis.com/dl_marketing_assets/dataland-logo.png`}
          width="42"
          height="38"
          alt="Dataland"
          style={logo}
        />
        <Heading style={heading}>
          Help {inviterName ?? "your teammate"} set up a data source on
          Dataland.io
        </Heading>
        <Text style={paragraph}>
          {inviterName ?? "Your teammate"}{" "}
          <span className="font-semibold">
            {inviterEmail ? `(${inviterEmail})` : ""}
          </span>{" "}
          invited you to join{" "}
          <span className="font-semibold">
            {workspaceName ? `the ${workspaceName} workspace ` : `a workspace `}
          </span>
          on Dataland. Dataland makes it easy for your whole team to browse data
          from your data warehouse.
        </Text>
        <Text style={paragraph}>They wrote you a note:</Text>
        <Text style={quote}>{customMessage}</Text>
        <Container style={spacer} />
        <Button pY={11} pX={23} style={button} href={workspaceLink}>
          Accept invite
        </Button>
        <Container style={spacer} />
        <Container style={spacer} />
        <Text style={paragraph}>
          You can also copy + paste this link into your browser:
        </Text>
        <Link href={workspaceLink} style={verify_link}>
          {workspaceLink}
        </Link>
        <Hr style={hr} />
        <Link href="https://dataland.io" style={reportLink}>
          Dataland.io: the ultimate data browser
        </Link>
      </Container>
    </Body>
  </Html>
);

export default DatalandVerifyEmail;

const logo = {
  width: 42,
  height: 38,
  padding: 12,
  backgroundColor: "#E7E5FF",
  borderRadius: 12,
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  padding: "20px 0 48px",
  width: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const quote = {
  paddingLeft: "20px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
  borderLeft: "4px solid #dfe1e4",
  fontStyle: "italic",
};

const buttonContainer = {
  padding: "12px 0 24px",
  align: "left" as const,
};

const button = {
  backgroundColor: "#4315F3",
  borderRadius: "6px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
};

const spacer = {
  padding: "6px 0",
};
const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#3c4149",
};

const verify_link = {
  fontSize: "14px",
  backgroundColor: "#F4F4F4",
  padding: "4px 8px",
  borderRadius: "4px",
};