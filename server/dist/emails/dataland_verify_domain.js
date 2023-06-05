import react_email_components from "@react-email/components";
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
export var DatalandVerifyDomain = function DatalandVerifyDomain(_ref) {
  var domain = _ref.domain,
    settingsLink = _ref.settingsLink,
    verificationCode = _ref.verificationCode;
  return /*#__PURE__*/React.createElement(Html, null, /*#__PURE__*/React.createElement(Head, null), /*#__PURE__*/React.createElement(Preview, null, "Verify the domain ", domain, " for Dataland"), /*#__PURE__*/React.createElement(Body, {
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
  }, "Verify the domain ", domain, " for Dataland"), /*#__PURE__*/React.createElement(Text, {
    style: code
  }, verificationCode), /*#__PURE__*/React.createElement(Text, {
    style: paragraph
  }, "Go to workspace settings to enter the code."), /*#__PURE__*/React.createElement(Container, {
    style: spacer
  }), /*#__PURE__*/React.createElement(Button, {
    pY: 11,
    pX: 23,
    style: button,
    href: settingsLink
  }, "Open settings"), /*#__PURE__*/React.createElement(Container, {
    style: spacer
  }), /*#__PURE__*/React.createElement(Container, {
    style: spacer
  }), /*#__PURE__*/React.createElement(Hr, {
    style: hr
  }), /*#__PURE__*/React.createElement(Link, {
    href: "https://dataland.io",
    style: reportLink
  }, "Dataland.io: the ultimate data browser"))));
};
export default DatalandVerifyDomain;
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
  width: "fit-content",
  fontWeight: "600",
  letterSpacing: "-0.3px",
  fontSize: "48px",
  lineHeight: "1.2",
  borderRadius: "4px",
  color: "#3c4149"
};
var verify_link = {
  fontSize: "14px",
  backgroundColor: "#F4F4F4",
  padding: "4px 8px",
  borderRadius: "4px"
};