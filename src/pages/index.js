import React from "react";
import { navigate, Link } from "gatsby";
import useLocalStorage from "../hooks/useLocalStorage";
import "../styles/index.css";
import Main from "../layouts/Main";

export default () => {
  const [ghToken, _] = useLocalStorage("githubAccessToken");

  React.useEffect(() => {
    if (!ghToken) {
      navigate("/signin");
    }
  }, [ghToken]);

  return (
    <Main>
      <button
        className="btn"
        onClick={() => {
          navigate("/statistics");
        }}
      >
        Get statistics
      </button>

      <Link
        to="/signin"
        style={{ color: "black", textDecoration: "underline" }}
      >
        Re-connect your github account
      </Link>
    </Main>
  );
};
