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
  domain?: string;
  settingsLink?: string;
  verificationCode?: string | number;
}

export const DatalandVerifyEmail = ({
  domain = "acme.io",
  settingsLink = "https://onebee-web.vercel.app/workspace/6/settings",
  verificationCode = 123456,
}: DatalandVerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify the domain {domain} for Dataland</Preview>
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
          Verify the domain {domain} for Dataland
        </Heading>
        <Text style={code}>{verificationCode}</Text>
        <Text style={paragraph}>
          Go to workspace settings to enter the code.
        </Text>
        <Container style={spacer} />
        <Button pY={11} pX={23} style={button} href={settingsLink}>
          Open settings
        </Button>
        <Container style={spacer} />
        <Container style={spacer} />
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
  width: "fit-content",
  fontWeight: "600",
  letterSpacing: "-0.3px",
  fontSize: "48px",
  lineHeight: "1.2",
  borderRadius: "4px",
  color: "#3c4149",
};

const verify_link = {
  fontSize: "14px",
  backgroundColor: "#F4F4F4",
  padding: "4px 8px",
  borderRadius: "4px",
};
