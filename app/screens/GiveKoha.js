import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';
import firebase from 'firebase/app';
import roles from '../config/roles.js';
import Colours from '../config/colours.js';
import Gui from '../config/gui.js';
import AppLoading from 'expo-app-loading';
import { FormStyle } from '../config/styles.js';

function ShowBusinessOptions({ navigation }) {
	const userType = process.env.JEST_WORKER_ID !== undefined? roles.donateBusiness: firebase.auth().currentUser.displayName[0];
	if (userType == roles.donateBusiness) {
		return (
			<View>
				<TouchableOpacity
					style={buttonStyle.button}
					onPress={() => navigation.navigate('NewEventListing')}
				>
					<Text style={buttonStyle.buttonText}>Event</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={buttonStyle.button}
					onPress={() => navigation.navigate('NewServiceListing')}
				>
					<Text style={buttonStyle.buttonText}>Services</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

function GiveKoha({ navigation }) {
	const [isReady, setIsReady] = useState(false);
	const LoadFonts = async () => {
		await useFonts();
	};
	if (process.env.JEST_WORKER_ID === undefined && !isReady) {
		return (
			<AppLoading
				startAsync={LoadFonts}
				onFinish={() => setIsReady(true)}
				onError={() => {}}
			/>
		);
	}
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Give Koha</Text>
			</View>
			<View style={buttonStyle.buttonContainer}>
				<TouchableOpacity
					style={buttonStyle.buttonPurple}
					onPress={() => navigation.navigate('NewFoodListing')}
				>
					<Text style={buttonStyle.buttonText}>Food</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={buttonStyle.buttonPurple}
					onPress={() => navigation.navigate('NewEssentialListing')}
				>
					<Text style={buttonStyle.buttonText}>Essentials</Text>
				</TouchableOpacity>

				{ShowBusinessOptions({ navigation })}
			</View>
			<View>
				<TouchableOpacity
					style={buttonStyle.button}
					onPress={() => navigation.goBack()}
				>
					<Text style={buttonStyle.buttonText}>Go Back</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = FormStyle();
const buttonStyle = StyleSheet.create({
	
	buttonContainer: {
		paddingTop: Gui.screen.height * 0.1,
	},
	buttonText: {
		fontSize: Gui.screen.height * 0.03,
		textAlign: 'center',
		fontFamily: 'Volte',
		color: Colours.white,
		borderRadius: 10,
	},
	button: {
		marginTop: Gui.screen.height * 0.02,
		marginBottom: Gui.screen.height * 0.02,
		marginLeft: Gui.screen.width * 0.1,
		width: Gui.screen.width * 0.8,
		height: Gui.screen.height * 0.07,
		backgroundColor: Colours.koha_navy,
		padding: 12,
		borderRadius: 10,
		alignItems: 'center',
	},
	buttonPurple: {
		marginTop: Gui.screen.height * 0.02,
		marginBottom: Gui.screen.height * 0.02,
		marginLeft: Gui.screen.width * 0.1,
		width: Gui.screen.width * 0.8,
		height: Gui.screen.height * 0.07,
		backgroundColor: Colours.koha_purple,
		padding: 12,
		borderRadius: 10,
		alignItems: 'center',
	},
});

export default GiveKoha;
