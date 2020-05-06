import React from 'react';
import { Helmet } from 'react-helmet';
import '../styles/index.css';
import { useGithubAccessToken } from './signin';
import { navigate } from 'gatsby';
import {useLocalStorage} from '@rehooks/local-storage';
import useGithubData from '../hooks/useGithubData';

const GITHUB_CLIENT_ID = '***REMOVED***';
const GITHUB_REDIRECT_URI= 'http://localhost:3000/oauth/github';
const GITHUB_AUTHORIZE_URL= `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=repo,user:email`;

export default () => {
  const [ghToken] = useLocalStorage('githubAccessToken');
  const [{ data, loading, error }, fetchGithubData] = useGithubData();

  if(!ghToken) {
    navigate('/signin');
  }
  
  const aggregatedData = React.useMemo(() => {
    if(!data) {
      return;
    }

    return data.viewer.pullRequests.edges.reduce(
      (acc, { node }) => ({ ...acc, additions: acc.additions + node.additions, deletions: acc.deletions + node.deletions}),
      { additions: 0, deletions: 0 }
    );
  }, [data]);

  return (
    <main>
      <Helmet>
        <title>Pulpo</title>
      </Helmet>
      <h1>Pulpo</h1>
      <button onClick={fetchGithubData} disabled={loading || error || data}>Fetch</button>
      {aggregatedData && (
        <>
          <p>PRs: {data.viewer.pullRequests.totalCount}</p>
          <p>Additions: {aggregatedData.additions}</p>
          <p>Deletions: {aggregatedData.deletions}</p>
          <p>Lines of code changed: {aggregatedData.additions + aggregatedData.deletions}</p>
          <p>Average size of PRs: {(aggregatedData.additions + aggregatedData.deletions)/data.viewer.pullRequests.totalCount}</p>
        </>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>Error...</p>}
    </main>
  );
}
