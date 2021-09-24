import React from 'react';
import Colours from '../config/colours.js';
import Gui from '../config/gui.js';

import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
} from 'react-native';

import firebase from 'firebase/app';
import 'firebase';

function Profile({ navigation }) {
	return (
		<View style={styles.container}>
			<Text>Profile Page</Text>
			<TouchableOpacity
				style={styles.button}
				onPress={() => {firebase.auth().signOut(); navigation.goBack();}}>
				<Text style={styles.buttonText}>Log Out</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.white,
		alignItems: 'center',
		justifyContent: 'center'
	},
	button: {
		marginTop: Gui.screen.height * 0.1,
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.2,
		height: Gui.screen.height * 0.1,
		borderRadius: 3,
		borderWidth: 1,
		borderColor: Colours.default,
	},
	buttonText: {
		fontSize: Gui.screen.height * 0.015,
		fontWeight: 'bold',
	},	
});

export default Profile;
