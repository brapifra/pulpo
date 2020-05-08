import React from "react";
import Logo from "../components/Logo";

export default ({ children }) => {
  return (
    <main
      className="c"
      style={{
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Logo />
      {children}
    </main>
  );
};
