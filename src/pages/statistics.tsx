import React from "react";
import Card from "../components/Card";
import Main from "../layouts/Main";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

type AggregatedData = { additions: number; deletions: 0 };

export default () => {
  const { data, loading, error } = useGithubData();

  const aggregatedData = React.useMemo(() => {
    if (!data) {
      return;
    }

    return data.viewer.pullRequests.edges.reduce(
      (acc: AggregatedData, { node }: any) => ({
        ...acc,
        additions: acc.additions + node.additions,
        deletions: acc.deletions + node.deletions,
      }),
      { additions: 0, deletions: 0 }
    );
  }, [data]);

  return (
    <Main>
      {error && (
        <p style={{ textAlign: "center" }}>
          Something happened:{" "}
          <div style={{ color: "red" }}>{error.message}</div>
        </p>
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

function useGithubData() {
  const queryResult = useQuery(query, {
    notifyOnNetworkStatusChange: true,
  });
  const { data, loading, error, fetchMore } = queryResult;

  React.useEffect(() => {
    if (
      !data ||
      error ||
      loading ||
      !data.viewer.pullRequests.pageInfo.hasNextPage
    ) {
      return;
    }

    fetchMore({
      variables: {
        after: data.viewer.pullRequests.pageInfo.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...fetchMoreResult,
          viewer: {
            ...fetchMoreResult.viewer,
            pullRequests: {
              ...fetchMoreResult.viewer.pullRequests,
              edges: [
                ...prev.viewer.pullRequests.edges,
                ...fetchMoreResult.viewer.pullRequests.edges,
              ],
            },
          },
        };
      },
    });
  }, [data]);

  return queryResult;
}

const query = gql`
  query($after: String) {
    rateLimit {
      cost
      remaining
    }
    viewer {
      id
      pullRequests(
        first: 100
        orderBy: { field: CREATED_AT, direction: DESC }
        after: $after
      ) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            title
            additions
            deletions
          }
        }
      }
    }
  }
`;
