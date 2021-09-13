import React from 'react';

import Colours from '../config/colours.js';

import { View, StyleSheet, Text } from 'react-native';

function CreateAccount({ navigation }) {
	return (
		<View style={styles.container}>
			<Text>Create Account WIP</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.white,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default CreateAccount;