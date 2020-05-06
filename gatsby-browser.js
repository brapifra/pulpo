/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it


import React from "react"
import Helmet from 'react-helmet';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import useLocalStorage from './src/hooks/useLocalStorage';
import './src/styles/lit.css';


export const wrapRootElement = ({ element }) => {
  return (
    <Wrapper>
      <Helmet>
        <title>Pulpo - Personal github statistics</title>
        <link href="https://fonts.googleapis.com/css?family=Nunito:300,400,700" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ajusa/lit@latest/dist/lit.css" />
      </Helmet>
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