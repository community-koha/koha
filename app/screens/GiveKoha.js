import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import firebase from 'firebase/app';
import roles from '../config/roles.js';
import Colours from '../config/colours.js';
import gui from '../config/gui.js';

function ShowBusinessOptions({ navigation }) {
	const userType = firebase.auth().currentUser.displayName[0];
	if (userType == roles.donateBusiness) {
		return (
			<View>
				<Button
					title="Event"
					onPress={() => navigation.navigate('NewEventListing')}
				/>
				<Button
					title="Services"
					onPress={() => navigation.navigate('NewServiceListing')}
				/>
			</View>
		);
	}
}

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
				{ShowBusinessOptions({ navigation })}
			</View>
			<View>
				<Button title="Go Back" onPress={() => navigation.goBack()} />
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
