module.exports = {
  siteMetadata: {
    title: "Pulpo - Personal github statistics",
  },
  plugins: [
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        whitelist: [
          "GITHUB_CLIENT_ID",
          "GITHUB_AUTHORIZE_URL",
          "GITHUB_GRAPHQL_ENDPOINT",
          "URL",
        ],
      },
    },
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Pulpo - Personal github statistics",
        short_name: "Pulpo - Personal github statistics",
        start_url: "/",
        icon: "src/images/pulpo.gif",
      },
    },
  ],
};
