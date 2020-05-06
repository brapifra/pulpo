module.exports = {
  siteMetadata: {
    title: 'Pulpo - Personal github statistics',
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
