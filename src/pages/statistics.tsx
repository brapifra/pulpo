import React from "react";
import { Link } from "gatsby";
import Card from "../components/Card";
import Main from "../layouts/Main";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ShareButton from "../components/ShareButton";

type AggregatedData = {
  additions: number;
  deletions: number;
  changedLines: number;
  avgPrSize: number;
};

export default () => {
  const { data, loading, error } = useGithubData();
  const hasMoreToFetch = !!data?.viewer?.pullRequests?.pageInfo?.hasNextPage;

  const aggregatedData: AggregatedData = React.useMemo(() => {
    const initialValue: AggregatedData = {
      additions: 0,
      deletions: 0,
      changedLines: 0,
      avgPrSize: 0,
    };

    if (!data) {
      return initialValue;
    }

    return data.viewer.pullRequests.edges.reduce(
      (acc: AggregatedData, { node }: any): AggregatedData => {
        const additions = acc.additions + node.additions;
        const deletions = acc.deletions + node.deletions;
        const changedLines = additions + deletions;
        const totalPrs = data?.viewer?.pullRequests?.totalCount || 0;

        return {
          ...acc,
          additions,
          deletions,
          changedLines,
          avgPrSize: Math.round(changedLines / totalPrs),
        };
      },
      initialValue
    );
  }, [data]);

  const edges = data?.viewer?.pullRequests?.edges || [];

  return (
    <Main>
      {error && (
        <>
          <p style={{ textAlign: "center" }}>
            Something happened:{" "}
            <div style={{ color: "red" }}>{error.message}</div>
          </p>
          <Link
            to="/signin"
            style={{ color: "black", textDecoration: "underline" }}
          >
            Re-connect your github account
          </Link>
        </>
      )}
      {(loading || hasMoreToFetch) && (
        <p>Fetching data... This may take a while</p>
      )}
      <div className="responsiveGrid">
        <Card
          title={data?.viewer?.pullRequests?.totalCount || 0}
          description="PRs created"
        />
        <Card
          title={formatDate(edges[edges.length - 1]?.node?.createdAt)}
          description="Oldest PR"
        />
        <Card
          title={aggregatedData.additions + aggregatedData.deletions}
          description="Lines changed"
        />
        <Card title={aggregatedData.additions} description="Additions" />
        <Card title={aggregatedData.deletions} description="Deletions" />
        <Card title={aggregatedData.avgPrSize} description="Average PR size" />
      </div>
      <ShareButton user={data?.viewer?.login || ""} />
    </Main>
  );
};

function useGithubData() {
  const queryResult = useQuery(query);
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
      login
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
            createdAt
            additions
            deletions
          }
        }
      }
    }
  }
`;

function formatDate(dateString?: string) {
  if (!dateString) {
    return "...";
  }

  return new Date(dateString).toLocaleDateString();
}
