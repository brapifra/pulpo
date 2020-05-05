import React from 'react';
import { Helmet } from 'react-helmet';
import '../styles/index.css';
import { useGithubAccessToken } from './signin';
import { navigate } from 'gatsby';
import {useLocalStorage} from '@rehooks/local-storage';

const GITHUB_CLIENT_ID = '***REMOVED***';
const GITHUB_REDIRECT_URI= 'http://localhost:3000/oauth/github';
const GITHUB_AUTHORIZE_URL= `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=repo,user:email`;

export default () => {
  const [ghToken] = useLocalStorage('githubAccessToken');

  if(!ghToken) {
    navigate('/signin');
  }


  return (
    <main>
      <Helmet>
        <title>Pulpo</title>
      </Helmet>
      <h1>Pulpo</h1>
      {ghToken}
    </main>
  );
}