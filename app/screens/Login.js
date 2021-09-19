import React from 'react';

import Colours from '../config/colours.js';
import Gui from '../config/gui.js';

import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';
import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	StatusBar,
} from 'react-native';

import firebase from 'firebase/app';
import 'firebase';

function Login({ navigation }) {
	useProxy = true;
	const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
		clientId: '388216366196238',
		responseType: ResponseType.Token,
		redirectUri: 'https://auth.expo.io/@needsadjustment/koha',
	});

	const [gRequest, gResponse, gPromptAsync] = Google.useIdTokenAuthRequest({
		clientId:
			'244543529302-p6dkdutiid2tv6e0l0ncq8tve8sfrom2.apps.googleusercontent.com',
	});

	React.useEffect(() => {
		if (fbResponse?.type === 'success') {
			const { access_token } = fbResponse.params;
			const credential =
				firebase.auth.FacebookAuthProvider.credential(access_token);
			firebase.auth().signInWithCredential(credential);
			if (firebase.auth().currentUser.displayName.substring(1, 2) == '|') {
				navigation.navigate('Nav');
			} else {
				navigation.navigate('UserType');
			}
		}
	}, [fbResponse]);

	React.useEffect(() => {
		if (gResponse?.type === 'success') {
			const { id_token } = gResponse.params;
			const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
			firebase.auth().signInWithCredential(credential);
			if (firebase.auth().currentUser.displayName.substring(1, 2) == '|') {
				navigation.navigate('Nav');
			} else {
				navigation.navigate('UserTypeScreen');
			}
		}
	}, [gResponse]);

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor={Colours.statusbar} />
			<Image style={styles.logo} source={require('../assets/logo.png')} />
			<View style={styles.buttons}>
				<TouchableOpacity
					disabled={!fbRequest}
					style={[styles.button, styles.fbButton]}
					onPress={() => {
						fbPromptAsync({ useProxy });
					}}
				>
					<Text style={styles.buttonText}>LOGIN WITH FACEBOOK</Text>
				</TouchableOpacity>
				<TouchableOpacity
					disabled={!gRequest}
					style={[styles.button, styles.googleButton]}
					onPress={() => {
						gPromptAsync();
					}}
				>
					<Text style={styles.buttonText}>LOGIN WITH GOOGLE</Text>
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
	buttons: {
		justifyContent: 'center',
		alignItems: 'center',
		top: Gui.screen.height * 0.08,
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
	fbButton: {
		backgroundColor: Colours.koha_navy,
	},
	googleButton: {
		backgroundColor: Colours.koha_peach,
	},
	buttonText: {
		fontSize: Gui.button.fontSize,
		color: Gui.button.textColour,
	},
});

export default Login;
