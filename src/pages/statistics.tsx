import React from "react";
import { Link } from "gatsby";
import Card from "../components/Card";
import Main from "../layouts/Main";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ShareButton from "../components/ShareButton";

type PullRequestsAggregatedData = {
  additions: number;
  deletions: number;
  changedLines: number;
  avgPrSize: number;
  firstPrDate?: string;
  mergedPrs: number;
};

type IssueCommentsAggregatedata = {
  commentsPerPr: { [prId: string]: number };
  firstCommentDate?: string;
  avgNumberOfCommentsPerPr: string;
};

export default () => {
  const { data, loading, error } = useGithubData();
  const hasMoreToFetch =
    !!data?.viewer?.pullRequests?.pageInfo?.hasNextPage ||
    !!data?.viewer?.issueComments?.pageInfo?.hasNextPage;

  const pullRequestsAggregatedData: PullRequestsAggregatedData = React.useMemo(() => {
    const initialValue: PullRequestsAggregatedData = {
      additions: 0,
      deletions: 0,
      changedLines: 0,
      avgPrSize: 0,
      mergedPrs: 0,
    };

    if (!data) {
      return initialValue;
    }

    const edges: any[] = data.viewer.pullRequests.edges;

    return edges.reduce(
      (
        acc: PullRequestsAggregatedData,
        { node }
      ): PullRequestsAggregatedData => {
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
          firstPrDate: edges[edges.length - 1]?.node?.createdAt,
          mergedPrs: node.merged ? acc.mergedPrs + 1 : acc.mergedPrs,
        };
      },
      initialValue
    );
  }, [data]);

  const issueCommentsAggregatedData: IssueCommentsAggregatedata = React.useMemo(() => {
    const initialValue: IssueCommentsAggregatedata = {
      commentsPerPr: {},
      avgNumberOfCommentsPerPr: "0",
    };

    if (!data) {
      return initialValue;
    }

    const edges: any[] = data.viewer.issueComments.edges;

    return edges.reduce(
      (
        acc: IssueCommentsAggregatedata,
        { node }
      ): IssueCommentsAggregatedata => {
        if (!node.pullRequest) {
          return acc;
        }

        const previousCount = acc.commentsPerPr[node.pullRequest.id] || 0;
        const commentsPerPr = {
          ...acc.commentsPerPr,
          [node.pullRequest.id]: previousCount + 1,
        };
        const numberOfCommentsPerPr: number[] = Object.values(commentsPerPr);
        const avgNumberOfCommentsPerPr = (
          numberOfCommentsPerPr.reduce((acc, comments) => comments + acc, 0) /
          numberOfCommentsPerPr.length
        ).toFixed(2);

        return {
          ...acc,
          firstCommentDate: edges[0]?.node?.createdAt,
          commentsPerPr,
          avgNumberOfCommentsPerPr,
        };
      },
      initialValue
    );
  }, [data]);

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
          title={pullRequestsAggregatedData.mergedPrs}
          description="PRs merged"
        />
        <Card
          title={Object.keys(issueCommentsAggregatedData.commentsPerPr).length}
          description="PRs reviewed"
        />

        <Card
          title={pullRequestsAggregatedData.avgPrSize}
          description="Avg. PR size"
        />
        <Card
          title={issueCommentsAggregatedData.avgNumberOfCommentsPerPr}
          description="Comments per review"
        />
        <Card
          title={data?.viewer?.repositoriesContributedTo?.totalCount || 0}
          description="Repositories contributed to"
        />

        <Card
          title={
            pullRequestsAggregatedData.additions +
            pullRequestsAggregatedData.deletions
          }
          description="Lines changed"
        />
        <Card
          title={pullRequestsAggregatedData.additions}
          description="Additions"
        />
        <Card
          title={pullRequestsAggregatedData.deletions}
          description="Deletions"
        />

        <Card
          title={formatDate(pullRequestsAggregatedData.firstPrDate)}
          description="First PR"
        />
        <Card
          title={formatDate(issueCommentsAggregatedData.firstCommentDate)}
          description="First comment"
        />
        <Card
          title={
            data?.viewer?.repositoriesContributedTo?.edges?.[0]?.node?.name ||
            "..."
          }
          description="Popular repo contributed to"
        />
      </div>
      {data && <ShareButton user={data?.viewer?.login || ""} />}
    </Main>
  );
};

function useGithubData() {
  const queryResult = useQuery(query, {
    variables: {
      firstPullRequests: 100,
      firstIssueComments: 100,
    },
  });
  const { data, loading, error, fetchMore } = queryResult;

  React.useEffect(() => {
    if (
      !data ||
      error ||
      loading ||
      (!data.viewer.pullRequests.pageInfo.hasNextPage &&
        !data.viewer.issueComments.pageInfo.hasNextPage)
    ) {
      return;
    }

    const variables = {
      afterPullRequest: data.viewer.pullRequests.pageInfo.endCursor,
      firstPullRequests:
        data.viewer.pullRequests.pageInfo.endCursor !== null ? 100 : 0,

      afterIssueComment: data.viewer.issueComments.pageInfo.endCursor,
      firstIssueComments:
        data.viewer.issueComments.pageInfo.endCursor !== null ? 100 : 0,
    };

    fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...fetchMoreResult,
          viewer: {
            ...fetchMoreResult.viewer,

            issueComments: {
              ...fetchMoreResult.viewer.issueComments,
              edges: [
                ...prev.viewer.issueComments.edges,
                ...fetchMoreResult.viewer.issueComments.edges,
              ],
            },

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

const paginationInfo = `
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
`;

const query = gql`
  query($afterIssueComment: String, $firstIssueComments: Int!, $afterPullRequest: String, $firstPullRequests: Int!) {
    rateLimit {
      cost
      remaining
    }
    viewer {
      login

      contributionsCollection {
        totalRepositoriesWithContributedCommits
        totalRepositoriesWithContributedPullRequests
      }

      issueComments(first: $firstIssueComments, after: $afterIssueComment) {
        ${paginationInfo}
        edges {
          cursor
          node {
            createdAt
            pullRequest {
              id
            }
          }
        }
      }

      pullRequests(
        first: $firstPullRequests
        orderBy: { field: CREATED_AT, direction: DESC }
        after: $afterPullRequest
      ) {
        ${paginationInfo}
        edges {
          cursor
          node {
            createdAt
            additions
            deletions
            merged
          }
        }
      }

      repositoriesContributedTo(first: 1, orderBy: {field: STARGAZERS, direction: DESC}) {
        totalCount
        nodes {
          name
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
