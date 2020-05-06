import React from 'react';
import { Helmet } from 'react-helmet';
import { navigate } from 'gatsby';
import useLocalStorage from '../hooks/useLocalStorage';
import Logo from '../components/Logo';
import Main from '../layouts/Main';
import config from '../utils/config';

const GITHUB_CLIENT_ID = '***REMOVED***';
const GITHUB_REDIRECT_URI= `${config.url}/oauth/github`;
const GITHUB_AUTHORIZE_URL= `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=repo,user:email`;


export default () => {
  const [_, setToken] = useLocalStorage('githubAccessToken');


  return (
    <Main>
      <Helmet>
        <title>Pulpo - Signin</title>
      </Helmet>
      <Logo />
      <button
        className="btn"
        onClick={() => {
          const popup = window.open(GITHUB_AUTHORIZE_URL, "", "width=500,height=650");

          popup.addEventListener('message', evt => {
            if(evt.data.type === 'close') {
              popup.close();
              setToken(evt.data.data.access_token);
              navigate('/');
            }
          })
        }}
      >
        Connect your github account
      </button>
    </Main>
  );
}
