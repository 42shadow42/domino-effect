const path = require('path')


module.exports = {
	stories: [
		'../stories/**/*.stories.mdx',
		'../stories/**/*.stories.@(js|jsx|ts|tsx)',
	],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
	],
	framework: '@storybook/react',
	webpackFinal: async (config ) => {
		config.resolve.alias = {
		  ...config.resolve.alias,
		  "@42shadow42/domino-effect": path.resolve(__dirname, "../src")
		};
	
		return config;
	  }
}
