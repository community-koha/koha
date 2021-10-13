import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';
import firebase from 'firebase/app';
import roles from '../config/roles.js';
import Colours from '../config/colours.js';
import Gui from '../config/gui.js';
import AppLoading from 'expo-app-loading';

function ShowBusinessOptions({ navigation }) {
	const userType = firebase.auth().currentUser.displayName[0];
	if (userType == roles.donateBusiness) {
		return (
			<View>
				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.navigate('NewEventListing')}
				>
					<Text style={styles.buttonText}>Event</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.navigate('NewServiceListing')}
				>
					<Text style={styles.buttonText}>Services</Text>
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
	if (!isReady) {
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
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.navigate('NewFoodListing')}
				>
					<Text style={styles.buttonText}>Food</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.navigate('NewEssentialListing')}
				>
					<Text style={styles.buttonText}>Essentials</Text>
				</TouchableOpacity>

				{ShowBusinessOptions({ navigation })}
			</View>
			<View>
				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.goBack()}
				>
					<Text style={styles.buttonText}>Go Back</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.white,
	},
	header: {
		paddingLeft: Gui.screen.width * 0.1,
		paddingRight: Gui.screen.width * 0.1,
		zIndex: 3,
		backgroundColor: Gui.container.backgroundColor,
		height: Gui.screen.height * 0.12,
		flexDirection: 'row',
		alignContent: 'space-between',
	},
	headerTitle: {
		alignItems: 'center',
		textAlign: 'center',
		textAlignVertical: 'center',
		fontFamily: 'Volte',
		fontSize: Gui.screen.height * 0.05,
		marginRight: Gui.screen.width * 0.2,
		color: Colours.koha_purple,
	},
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
});

export default GiveKoha;
