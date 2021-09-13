import React from 'react';

import Colours from '../config/colours.js';

import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';
import { View, StyleSheet, Button, StatusBar } from 'react-native';

import firebase from 'firebase/app';
import 'firebase';

function Login({ navigation }) {
	const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
		clientId: '388216366196238',
		responseType: ResponseType.Token,
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
			navigation.navigate('Nav');
		}
	}, [fbResponse]);

	React.useEffect(() => {
		if (gResponse?.type === 'success') {
			const { id_token } = gResponse.params;
			const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
			firebase.auth().signInWithCredential(credential);
			navigation.navigate('Nav');
		}
	}, [gResponse]);

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor={Colours.statusbar} />
			<Button
				disabled={!fbRequest}
				title="Login with Facebook"
				onPress={() => {
					fbPromptAsync();
				}}
			/>
			<Button
				disabled={!gRequest}
				title="Login with Google"
				onPress={() => {
					gPromptAsync();
				}}
			/>
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

export default Login;
