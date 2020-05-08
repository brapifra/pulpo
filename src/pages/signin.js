import React from "react";
import { Helmet } from "react-helmet";
import useLocalStorage from "../hooks/useLocalStorage";
import Logo from "../components/Logo";
import Main from "../layouts/Main";
import Config from "../config";

const GITHUB_REDIRECT_URL = `${Config.URL}/oauth/github`;
const GITHUB_AUTHORIZE_URL = `${Config.GITHUB_AUTHORIZE_URL}?client_id=${Config.GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URL}&scope=repo,user:email`;

export default () => {
  const [_, setToken] = useLocalStorage("githubAccessToken");

  return (
    <Main>
      <Helmet>
        <title>Pulpo - Signin</title>
      </Helmet>
      <Logo />
      <button
        className="btn"
        onClick={() => {
          const popup = window.open(
            GITHUB_AUTHORIZE_URL,
            "",
            "width=500,height=650"
          );

          popup.addEventListener("message", (evt) => {
            if (evt.data.type === "close") {
              popup.close();
              setToken(evt.data.data.access_token);
              window.location.pathname = "/";
            }
          });
        }}
      >
        Connect your github account
      </button>
    </Main>
  );
};
