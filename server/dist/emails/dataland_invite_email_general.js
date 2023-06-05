import react_email_components from '@react-email/components';
var Body = react_email_components.Body,
  Button = react_email_components.Button,
  Container = react_email_components.Container,
  Head = react_email_components.Head,
  Heading = react_email_components.Heading,
  Hr = react_email_components.Hr,
  Html = react_email_components.Html,
  Img = react_email_components.Img,
  Link = react_email_components.Link,
  Preview = react_email_components.Preview,
  Section = react_email_components.Section,
  Text = react_email_components.Text;
import * as React from "react";
var baseUrl = process.env.VERCEL_URL ? "https://".concat(process.env.VERCEL_URL) : "";
export var DatalandInviteTeammateGeneral = function DatalandInviteTeammateGeneral(_ref) {
  var inviterName = _ref.inviterName,
    inviterEmail = _ref.inviterEmail,
    customMessage = _ref.customMessage,
    workspaceName = _ref.workspaceName,
    workspaceLink = _ref.workspaceLink;
  return /*#__PURE__*/React.createElement(Html, null, /*#__PURE__*/React.createElement(Head, null), /*#__PURE__*/React.createElement(Preview, null, inviterName !== null && inviterName !== void 0 ? inviterName : "Your teammate", " invited you to join", " ", workspaceName ? "the ".concat(workspaceName, " workspace ") : "a workspace ", " on Dataland.io"), /*#__PURE__*/React.createElement(Body, {
    style: main
  }, /*#__PURE__*/React.createElement(Container, {
    style: container,
    align: "left"
  }, /*#__PURE__*/React.createElement(Img, {
    src: "https://storage.googleapis.com/dl_marketing_assets/dataland-logo.png",
    width: "42",
    height: "38",
    alt: "Dataland",
    style: logo
  }), /*#__PURE__*/React.createElement(Heading, {
    style: heading
  }, inviterName !== null && inviterName !== void 0 ? inviterName : "Your teammate", " invited you to join", " ", workspaceName ? "the ".concat(workspaceName, " workspace") : "a workspace ", " ", "on Dataland.io"), /*#__PURE__*/React.createElement(Text, {
    style: paragraph
  }, inviterName !== null && inviterName !== void 0 ? inviterName : "Your teammate", " ", /*#__PURE__*/React.createElement("span", {
    className: "font-semibold"
  }, inviterEmail ? "(".concat(inviterEmail, ")") : ""), " ", "invited you to join", " ", /*#__PURE__*/React.createElement("span", {
    className: "font-semibold"
  }, workspaceName ? "the ".concat(workspaceName, " workspace ") : "a workspace "), "on Dataland. Dataland makes it easy for your whole team to browse data from your data warehouse."), /*#__PURE__*/React.createElement(Container, {
    style: spacer
  }), /*#__PURE__*/React.createElement(Button, {
    pY: 11,
    pX: 23,
    style: button,
    href: workspaceLink
  }, "Accept invite"), /*#__PURE__*/React.createElement(Container, {
    style: spacer
  }), /*#__PURE__*/React.createElement(Container, {
    style: spacer
  }), /*#__PURE__*/React.createElement(Text, {
    style: paragraph
  }, "You can also copy + paste this link into your browser:"), /*#__PURE__*/React.createElement(Link, {
    href: workspaceLink,
    style: verify_link
  }, workspaceLink), /*#__PURE__*/React.createElement(Hr, {
    style: hr
  }), /*#__PURE__*/React.createElement(Link, {
    href: "https://dataland.io",
    style: reportLink
  }, "Dataland.io: the ultimate data browser"))));
};
var logo = {
  width: 42,
  height: 38,
  padding: 12,
  backgroundColor: "#E7E5FF",
  borderRadius: 12
};
var main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
};
var container = {
  padding: "20px 0 48px",
  width: "560px"
};
var heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0"
};
var paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149"
};
var quote = {
  paddingLeft: "20px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
  borderLeft: "4px solid #dfe1e4",
  fontStyle: "italic"
};
var buttonContainer = {
  padding: "12px 0 24px",
  align: "left"
};
var button = {
  backgroundColor: "#4315F3",
  borderRadius: "6px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center",
  display: "block"
};
var spacer = {
  padding: "6px 0"
};
var reportLink = {
  fontSize: "14px",
  color: "#b4becc"
};
var hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px"
};
var code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#3c4149"
};
var verify_link = {
  fontSize: "14px",
  backgroundColor: "#F4F4F4",
  padding: "4px 8px",
  borderRadius: "4px"
};