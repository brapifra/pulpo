import React from 'react';
import { navigate } from 'gatsby';
import useLocalStorage from '../hooks/useLocalStorage';
import useGithubData from '../hooks/useGithubData';
import Logo from '../components/Logo';
import '../styles/index.css';
import Main from '../layouts/Main';

export default () => {
  const [ghToken] = useLocalStorage('githubAccessToken');
  const [{ data, loading, error }, fetchGithubData] = useGithubData();

  React.useEffect(() => {
    if(!ghToken) {
      navigate('/signin');
    }
  }, [ghToken]);
  
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
    <Main>
      <Logo />
      <button className="btn" onClick={fetchGithubData} disabled={loading || error || data}>Get statistics</button>
      {aggregatedData && (
        <>
          <p>PRs: {data.viewer.pullRequests.totalCount}</p>
          <p>Additions: {aggregatedData.additions}</p>
          <p>Deletions: {aggregatedData.deletions}</p>
          <p>Lines of code changed: {aggregatedData.additions + aggregatedData.deletions}</p>
          <p>Average size of PRs: {(aggregatedData.additions + aggregatedData.deletions)/data.viewer.pullRequests.totalCount}</p>
        </>
      )}
      {loading && <p>Fetching data... This may take a while</p>}
      {error && <p>Something happened: {error.message}</p>}
    </Main>
  );
}
