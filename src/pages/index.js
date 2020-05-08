import React from "react";
import { navigate } from "gatsby";
import useLocalStorage from "../hooks/useLocalStorage";
import useGithubData from "../hooks/useGithubData";
import Logo from "../components/Logo";
import "../styles/index.css";
import Main from "../layouts/Main";
import Card from "../components/Card";

export default () => {
  const [ghToken, _, removeGhToken] = useLocalStorage("githubAccessToken");
  const [{ data, loading, error }, fetchGithubData] = useGithubData();

  React.useEffect(() => {
    if (!ghToken) {
      navigate("/signin");
    }
  }, [ghToken]);

  const aggregatedData = React.useMemo(() => {
    if (!data) {
      return;
    }

    return data.viewer.pullRequests.edges.reduce(
      (acc, { node }) => ({
        ...acc,
        additions: acc.additions + node.additions,
        deletions: acc.deletions + node.deletions,
      }),
      { additions: 0, deletions: 0 }
    );
  }, [data]);

  return (
    <Main>
      <Logo />
      {!error && !aggregatedData && (
        <button
          className="btn"
          onClick={fetchGithubData}
          disabled={loading || error || data}
        >
          Get statistics
        </button>
      )}
      {error && (
        <>
          <p style={{ textAlign: "center" }}>
            Something happened: <p style={{ color: "red" }}>{error.message}</p>
          </p>
          <button
            className="btn"
            onClick={() => {
              removeGhToken();
              navigate("/signin");
            }}
          >
            Re-connect your github account
          </button>
        </>
      )}
      {loading && <p>Fetching data... This may take a while</p>}
      {aggregatedData && (
        <div
          style={{
            overflowX: "auto",
            display: "flex",
            flexDirection: "row",
            maxWidth: "90%",
            alignItems: "center",
          }}
        >
          <Card
            title={data.viewer.pullRequests.totalCount}
            description="PRs created"
          />
          <Card
            title={aggregatedData.additions + aggregatedData.deletions}
            description="Lines changed"
          />
          <Card title={aggregatedData.additions} description="Additions" />
          <Card title={aggregatedData.deletions} description="Deletions" />
          <Card
            title={Math.round(
              (aggregatedData.additions + aggregatedData.deletions) /
                data.viewer.pullRequests.totalCount
            )}
            description="Average PR size"
          />
        </div>
      )}
    </Main>
  );
};
