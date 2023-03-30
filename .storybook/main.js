const path = require('path');
module.exports = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.tsx'],
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
    config.module.rules = [
      ...config.module.rules.map((rule) => {
        return rule.test?.test('.tsx') ?
          {
            ...rule,
            resourceQuery: { not: [/raw/] },
          } : rule
      }),
    ]
    return config;
  },
  typescript: { reactDocgen: true },
};