import React from 'react';
import { Helmet } from 'react-helmet';
import '../styles/index.css';
import { navigate } from 'gatsby';
import {useLocalStorage} from '@rehooks/local-storage';

const GITHUB_CLIENT_ID = '***REMOVED***';
const GITHUB_REDIRECT_URI= 'http://localhost:3000/oauth/github';
const GITHUB_AUTHORIZE_URL= `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=repo,user:email`;


export default () => {
  const [_, setToken] = useLocalStorage('githubAccessToken');


  return (
    <main>
      <Helmet>
        <title>Pulpo - Signin</title>
      </Helmet>
      <h1>Pulpo</h1>
      <h2>Signin with your github account</h2>
      <button onClick={() => {
        const popup = window.open(GITHUB_AUTHORIZE_URL, "", "width=500,height=650");

        popup.addEventListener('message', evt => {
          if(evt.data.type === 'close') {
            popup.close();
            setToken(evt.data.data.access_token);
            console.log(evt.data.data);
            navigate('/');
          }
        })
      }}>
        Login
      </button>
    </main>
  );
}
