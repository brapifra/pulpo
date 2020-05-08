import React from "react";
import { gql } from "apollo-boost";
import { useApolloClient } from "@apollo/react-hooks";

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

export default function useGithubData() {
  const client = useApolloClient();
  const [dataInState, setDataInState] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState();

  async function fetchData() {
    try {
      setLoading(true);
      const { data, errors } = await client.query({ query });

      if (errors) {
        setError(errors[0]);
        return;
      }

      let finalData = data;

      while (finalData.viewer.pullRequests.pageInfo.hasNextPage) {
        const {
          data: fetchMoreResult,
          errors: fetchMoreErrors,
        } = await client.query({
          query,
          variables: {
            after: finalData.viewer.pullRequests.pageInfo.endCursor,
          },
        });

        if (fetchMoreErrors > 0) {
          setError(fetchMoreErrors[0]);
          return;
        }

        finalData = {
          ...fetchMoreResult,
          viewer: {
            ...fetchMoreResult.viewer,
            pullRequests: {
              ...fetchMoreResult.viewer.pullRequests,
              edges: [
                ...finalData.viewer.pullRequests.edges,
                ...fetchMoreResult.viewer.pullRequests.edges,
              ],
            },
          },
        };
      }

      setLoading(false);
      setDataInState(finalData);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  }

  return [{ data: dataInState, loading, error }, fetchData];
}
