import React from 'react';

import Colours from '../config/colours.js';

import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { ResponseType } from 'expo-auth-session';
import { View, StyleSheet, Button, TabBarIOS } from 'react-native';

import firebase from 'firebase/app';
import 'firebase';

function FBLogin({ navigation }) {
	const [request, response, promptAsync] = Facebook.useAuthRequest({
		clientId: '388216366196238',
		responseType: ResponseType.Token,
	});

	React.useEffect(() => {
		if (response?.type === 'success') {
			const { access_token } = response.params;
			const credential =
				firebase.auth.FacebookAuthProvider.credential(access_token);
			firebase.auth().signInWithCredential(credential);
			isSignedIn = true;
			navigation.navigate('Nav');
		}
	}, [response]);

	return (
		<View style={styles.container}>
			<Button
				disabled={!request}
				title="Login"
				onPress={() => {
					promptAsync();
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

export default FBLogin;
