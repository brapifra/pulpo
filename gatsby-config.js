module.exports = {
  siteMetadata: {
    title: 'Gatsby + Node.js (TypeScript) API',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Pulpo - Personal github statistics',
        short_name: 'Pulpo - Personal github statistics',
        start_url: '/',
        icon: 'src/images/pulpo.gif',
      },
    },
  ],
};
