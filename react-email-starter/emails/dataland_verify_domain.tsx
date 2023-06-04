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
  slug?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const DatalandVerifyEmail = ({
  slug = "/verify/" + "97aa0d97-53a9-4a20-8dec-c43824dd12e1",
}: DatalandVerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your Dataland account</Preview>
    <Body style={main}>
      <Container style={container} align="left">
        <Img
          src={`https://storage.googleapis.com/dl_marketing_assets/dataland-logo.png`}
          width="42"
          height="38"
          alt="Dataland"
          style={logo}
        />
        <Heading style={heading}>Verify your Dataland account</Heading>
        <Text style={paragraph}>
          Thanks for signing up for Dataland! To continue, click the button
          below to verify your account.
        </Text>
        <Container style={spacer} />
        <Button pY={11} pX={23} style={button} href="https://dataland.io">
          Verify account
        </Button>
        <Container style={spacer} />
        <Container style={spacer} />
        <Text style={paragraph}>
          You can also copy + paste this link into your browser:
        </Text>
        <Link href="https://dataland.io" style={verify_link}>
          {"https://dataland.io" + slug}
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

const buttonContainer = {
  padding: "12px 0 24px",
  align: "left" as const,
};

const button = {
  backgroundColor: "#4315F3",
  borderRadius: "3px",
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
