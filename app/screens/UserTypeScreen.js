import React, { useState } from 'react';

import Colours from '../config/colours.js';
import Gui from '../config/gui.js';
import Roles from '../config/roles.js';
import AppLoading from 'expo-app-loading';

import firebase from 'firebase/app';
import 'firebase';

import useFonts from '../config/useFonts';

import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	StatusBar,
} from 'react-native';

function UserTypeScreen({ navigation }) {
	const [isReady, setIsReady] = useState(false);
	const LoadFonts = async () => {
		await useFonts();
	};

	if (process.env.JEST_WORKER_ID === undefined) {
		React.useEffect(
			() =>
				navigation.addListener('beforeRemove', (e) => {
					e.preventDefault();
				}),
			[navigation]
		);
	}	

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
			<StatusBar
				backgroundColor={Colours.koha_background}
				barStyle="dark-content"
			/>
			<Image style={styles.logo} source={require('../assets/logo.png')} />
			<Text style={styles.text}>I am:</Text>
			<View style={styles.buttons}>
				<TouchableOpacity
					style={[styles.button, styles.inNeedButton]}
					onPress={() => {
						const username = firebase.auth().currentUser.displayName;
						firebase.auth().currentUser.updateProfile({
							displayName: Roles.inNeed + '|' + username,
						});
						navigation.navigate('Nav');
					}}
				>
					<Text style={styles.buttonText}>IN NEED</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.button, styles.donatingButton]}
					onPress={() => {
						const username = firebase.auth().currentUser.displayName;
						firebase.auth().currentUser.updateProfile({
							displayName: Roles.donateIndividual + '|' + username,
						});
						navigation.navigate('Nav');
					}}
				>
					<Text style={styles.buttonText}>DONATING</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.button, styles.donatingButton]}
					onPress={() => {
						const username = firebase.auth().currentUser.displayName;
						firebase.auth().currentUser.updateProfile({
							displayName: Roles.donateBusiness + '|' + username,
						});
						navigation.navigate('Nav');
					}}
				>
					<Text style={styles.buttonText}>DONATING AS A BUSINESS</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.button, styles.backButton]}
					onPress={() => {
						firebase.auth().signOut();
						navigation.navigate('Entry');
					}}
				>
					<Text style={styles.buttonText}>BACK</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Gui.container.backgroundColor,
		alignItems: 'center',
	},
	logo: {
		resizeMode: 'contain',
		top: Gui.screen.height * 0.1,
		width: Gui.screen.width * 0.6,
		height: Gui.screen.height * 0.3,
	},
	text: {
		top: Gui.screen.height * 0.14,
		fontSize: Gui.screen.height * 0.05,
		color: Colours.koha_purple,
		textAlign: 'center',
		fontFamily: 'Volte',
	},
	buttons: {
		justifyContent: 'center',
		alignItems: 'center',
		top: Gui.screen.height * 0.1,
		height: Gui.screen.height * 0.5,
		width: Gui.screen.width * 0.75,
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.button.width,
		height: Gui.button.height,
		borderRadius: Gui.button.borderRadius,
		borderColor: Gui.button.borderColour,
		borderRadius: Gui.button.borderRadius,
		marginBottom: Gui.screen.height * 0.02,
	},
	inNeedButton: {
		backgroundColor: Colours.koha_navy,
	},
	donatingButton: {
		backgroundColor: Colours.koha_lightblue,
	},
	backButton: {
		backgroundColor: Colours.koha_peach,
	},
	buttonText: {
		fontSize: Gui.button.fontSize * 0.8,
		fontFamily: 'Volte',
		color: Gui.button.textColour,
	},
});

export default UserTypeScreen;
