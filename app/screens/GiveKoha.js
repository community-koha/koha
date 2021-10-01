import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import Colours from '../config/colours.js';
import gui from '../config/gui.js';

function GiveKoha({ navigation }) {
	return (
		<View style={styles.container}>
			<View style={styles.buttonContainer}>
				<Button
					title="Food"
					onPress={() => navigation.navigate('NewFoodListing')}
				/>
				<Button
					title="Essentials"
					onPress={() => navigation.navigate('NewEssentialListing')}
				/>
				{/* Below buttons to be hidden for individual */}
				<Button
					title="Event"
					onPress={() => navigation.navigate('NewEventListing')}
				/>
				<Button
					title="Services"
					onPress={() => navigation.navigate('NewServiceListing')}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.white,
	},
	buttonContainer: {
		paddingTop: gui.screen.height * 0.1,
	},
});

export default GiveKoha;
