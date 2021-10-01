import React from 'react';
import Colours from '../config/colours.js';
import Gui from '../config/gui.js';

import { View, StyleSheet, Text } from 'react-native';

function Notification({ navigation }) {
	return (
		<View style={styles.container}>
			<Text>Notification Page</Text>
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

export default Notification;
