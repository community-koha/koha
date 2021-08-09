const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
	const config = await createExpoWebpackConfigAsync(env, argv);
	// Customize the config before returning it.
	config.resolve.alias['react-native'] = 'react-native-web';
	config.resolve.alias['react-native-maps'] = 'react-native-web-maps';
	return config;
};
