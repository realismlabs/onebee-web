import React from "react";
import "../styles/GradientBorder.module.css";

const GradientBorder = ({ children }) => {
  return <div className="gradient-border">{children}</div>;
};

export default GradientBorder;
