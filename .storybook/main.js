const path = require('path');
module.exports = {
  stories: ['../stories/**/*.mdx'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  webpackFinal: async config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@42shadow42/domino-effect": path.resolve(__dirname, "../src")
    };
    return config;
  },
  docs: {
    autodocs: true,
  },
  typescript: { reactDocgen: false },
};