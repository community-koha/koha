import React from 'react';

import Colours from '../config/colours.js';
import Gui from '../config/gui.js';
import Roles from '../config/roles.js';

import firebase from 'firebase/app';
import 'firebase';

import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	StatusBar,
} from 'react-native';

function UserTypeScreen({ navigation }) {
	return (
		<View style={styles.container}>
			<StatusBar backgroundColor={Colours.statusbar} />
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
		top: Gui.screen.height * 0.18,
		width: Gui.screen.width * 0.6,
		height: Gui.screen.height * 0.3,
	},
	text: {
		top: Gui.screen.height * 0.22,
		fontSize: Gui.screen.height * 0.03,
		textAlign: 'center',
		fontWeight: 'bold',
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
		marginBottom: Gui.button.spacing,
	},
	inNeedButton: {
		backgroundColor: Colours.koha_navy,
	},
	donatingButton: {
		backgroundColor: Colours.koha_blue,
	},
	buttonText: {
		fontSize: Gui.button.fontSize,
		color: Gui.button.textColour,
	},
});

export default UserTypeScreen;
