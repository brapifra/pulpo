import React from "react";
import { Helmet } from "react-helmet";
import { navigate } from "gatsby";
import { useLocation } from "@reach/router";
import useLocalStorage from "../hooks/useLocalStorage";
import Logo from "../components/Logo";
import Main from "../layouts/Main";

***REMOVED***

export default () => {
  const [_, setToken] = useLocalStorage("githubAccessToken");
  const location = useLocation();

  return (
    <Main>
      <Helmet>
        <title>Pulpo - Signin</title>
      </Helmet>
      <Logo />
      <button
        className="btn"
        onClick={() => {
          const githubRedirectUri = `${location.protocol}//${location.host}/oauth/github`;
          const githubAuthorizeUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${githubRedirectUri}&scope=repo,user:email`;
          const popup = window.open(
            githubAuthorizeUrl,
            "",
            "width=500,height=650"
          );

          popup.addEventListener("message", (evt) => {
            if (evt.data.type === "close") {
              popup.close();
              setToken(evt.data.data.access_token);
              navigate("/");
            }
          });
        }}
      >
        Connect your github account
      </button>
    </Main>
  );
};
