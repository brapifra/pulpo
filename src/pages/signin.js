import React from "react";
import { Helmet } from "react-helmet";
import useLocalStorage from "../hooks/useLocalStorage";
import Main from "../layouts/Main";
import Config from "../config";

const GITHUB_REDIRECT_URL = `${Config.URL}/oauth/github`;

console.log(Config);
console.log(GITHUB_REDIRECT_URL);

export default () => {
  const [_, setToken] = useLocalStorage("githubAccessToken");
  const [repoScope, setRepoScope] = React.useState("repo");

  return (
    <Main>
      <Helmet>
        <title>Pulpo - Signin</title>
      </Helmet>
      <select
        value={repoScope}
        onChange={({ target: { value } }) => {
          setRepoScope(value);
        }}
        style={{ border: "solid #eee" }}
        className="card"
      >
        <option value="public_repo">Public repositories</option>
        <option value="repo">Public and private repositories</option>
      </select>
      <button
        style={{ marginTop: 16 }}
        className="btn"
        onClick={() => {
          const githubAuthorizeUrl = `${Config.GITHUB_AUTHORIZE_URL}?client_id=${Config.GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URL}&scope=${repoScope},user:email`;

          const popup = window.open(
            githubAuthorizeUrl,
            "",
            "width=500,height=650"
          );

          window.addEventListener("message", (evt) => {
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
