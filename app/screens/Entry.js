import React, { useState } from 'react';
import AppLoading from 'expo-app-loading';
import Colours from '../config/colours.js';
import Gui from '../config/gui.js';

import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	StatusBar,
} from 'react-native';

import * as Font from 'expo-font';

function Entry({ navigation }) {
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
			<StatusBar backgroundColor={Colours.white} barStyle="dark-content" />
			<Image style={styles.logo} source={require('../assets/logo.png')} />
			<View style={styles.buttons}>
				<TouchableOpacity
					style={[styles.button, styles.loginButton]}
					onPress={() => navigation.navigate('Login')}
				>
					<Text style={styles.buttonText}>LOG IN</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.button, styles.signupButton]}
					onPress={() => navigation.navigate('CreateAccount')}
				>
					<Text style={styles.buttonText}>CREATE ACCOUNT</Text>
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
		height: Gui.screen.height * 0.6,
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
	loginButton: {
		backgroundColor: Colours.koha_purple,
	},
	signupButton: {
		backgroundColor: Colours.koha_navy,
	},
	buttonText: {
		fontSize: Gui.button.fontSize,
		color: Gui.button.textColour,
		fontFamily: 'Volte',
		letterSpacing: Gui.button.letterSpacing,
	},
});

export default Entry;
