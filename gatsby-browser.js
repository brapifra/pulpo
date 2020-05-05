/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it


import React from "react"
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { useLocalStorage } from '@rehooks/local-storage';



export const wrapRootElement = ({ element }) => {
  return (
    <Wrapper>
      {element}
    </Wrapper>
  )
}

function Wrapper({children}) {
  const [githubAccessToken] = useLocalStorage('githubAccessToken');
  const client = React.useMemo(() => {
    return new ApolloClient({
      uri: 'https://api.github.com/graphql',
      request: (operation) => {
        operation.setContext({
          headers: {
            authorization: githubAccessToken ? `Bearer ${githubAccessToken}` : ''
          }
        })
      }
    });
  }, [githubAccessToken])

  
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}