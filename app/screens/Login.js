import React, { useState } from 'react';

import Colours from '../config/colours.js';
import Gui from '../config/gui.js';
import AppLoading from 'expo-app-loading';

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
	ActivityIndicator,
	TextInput,
	Modal,
	Platform,
} from 'react-native';

import firebase from 'firebase/app';
import 'firebase';
import gui from '../config/gui.js';
import { ScrollView } from 'react-native-gesture-handler';

import useFonts from '../config/useFonts';

function Login({ navigation }) {
	const [web, setweb] = useState(Platform.OS == 'web');
	const [submitted, setSubmitted] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalText, setModalText] = useState('');
	const [modalResetVisible, setModalResetVisible] = useState(false);
	const [modalResetText, setModalResetText] = useState('');

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [isReady, setIsReady] = useState(process.env.JEST_WORKER_ID !== undefined? true: false);
	const LoadFonts = async () => {
		await useFonts();
	};

	function resetPasswordDialog() {
		setModalResetText('');
		setModalResetVisible(true);
		return true;
	}

	function resetPassword(resetEmail = '') {
		setModalResetText('');
		setModalResetVisible(false);

		// Only send reset email to an actual email address
		if (resetEmail != '' && resetEmail.indexOf('@') > -1) {
			firebase
				.auth()
				.sendPasswordResetEmail(resetEmail)
				.then(() => {})
				.catch(() => {});
		}

		// Don't inform the user if it's successful or not
		setModalText(
			"A password reset request has been sent to '" + resetEmail + "'"
		);
		setModalVisible(true);
		return true;
	}

	function login(email = '', password = '') {
		if (email == '') {
			setModalText('Please enter your email address');
			setModalVisible(true);
			return false;
		} else if (password == '') {
			setModalText('Please enter your password');
			setModalVisible(true);
			return false;
		}
		setSubmitted(true);

		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				var user = userCredential.user;
				console.log("User '" + user.uid + "' successfully logged in!");

				// Navigate to the next screen
				if (user.displayName.substring(1, 2) == '|') {
					navigation.navigate('Nav');
				} else if (!user.emailVerified) {
					navigation.navigate('VerifyEmail');
				} else {
					navigation.navigate('UserType');
				}
			})
			.catch((error) => {
				// If the user does not exist then redirect to the account creation screen
				if (
					error.code == 'auth/user-not-found' ||
					error.code == 'auth/wrong-password'
				) {
					error.message = 'The email or password is incorrect.';
				} else if (error.code == 'auth/user-disabled') {
					error.message =
						'This user account has been disabled by an administrator.\nContact Community Koha for more information.';
				}

				console.error(error);
				setModalText(error.message);
				setModalVisible(true);
				setSubmitted(false);
			});

		return true;
	}

	// useProxy = true;
	const [fbRequest, fbResponse, fbPromptAsync] = process.env.JEST_WORKER_ID !== undefined? [null,null,null]: Facebook.useAuthRequest({
		clientId: '388216366196238',
		responseType: ResponseType.Token,
		// redirectUri: 'https://auth.expo.io/@needsadjustment/koha',
	});

	const [gRequest, gResponse, gPromptAsync] = process.env.JEST_WORKER_ID !== undefined? [null,null,null]: Google.useIdTokenAuthRequest({
		clientId:
			'244543529302-p6dkdutiid2tv6e0l0ncq8tve8sfrom2.apps.googleusercontent.com',
	});

	React.useEffect(() => {
		if (fbResponse?.type === 'success') {
			const { access_token } = fbResponse.params;
			const credential =
				firebase.auth.FacebookAuthProvider.credential(access_token);
			var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					if (user.displayName.substring(1, 2) == '|') {
						navigation.navigate('Nav');
					} else {
						navigation.navigate('UserType');
					}
					unsubscribe();
				}
			});
			firebase.auth().signInWithCredential(credential);
		} else {
			setSubmitted(false);
		}
	}, [fbResponse]);

	React.useEffect(() => {
		if (gResponse?.type === 'success') {
			const { id_token } = gResponse.params;
			const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
			var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					if (user.displayName.substring(1, 2) == '|') {
						navigation.navigate('Nav');
					} else {
						navigation.navigate('UserType');
					}
					unsubscribe();
				}
			});
			firebase.auth().signInWithCredential(credential);
		} else {
			setSubmitted(false);
		}
	}, [gResponse]);

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
		<ScrollView style={styles.scroll}>
			<View style={styles.container}>
				<StatusBar
					backgroundColor={Colours.koha_background}
					barStyle="dark-content"
				/>
				<Image style={styles.logo} source={require('../assets/logo.png')} />
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						setModalVisible(false);
					}}
				>
					<View style={styles.modalCenter}>
						<View style={styles.modalView}>
							<View style={styles.modalViewText}>
								<Text style={styles.modalText}>{modalText}</Text>
							</View>
							<TouchableOpacity
								style={[styles.modalButton]}
								onPress={() => {
									setModalVisible(false);
								}}
							>
								<Text style={styles.modalButtonText}>OK</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalResetVisible}
					onRequestClose={() => {
						setModalResetVisible(false);
					}}
				>
					<TouchableOpacity
						style={[styles.modalButton, styles.modalFullScreen]}
						onPress={() => {
							setModalResetVisible(false);
						}}
					/>
					<View style={styles.modalResetCenter}>
						<View style={[styles.modalView, styles.modalResetView]}>
							<Text style={[styles.modalText, styles.modalResetTitle]}>
								Account Email Address
							</Text>
							<TextInput
								onChangeText={(val) => {
									setModalResetText(val);
								}}
								value={modalResetText}
								placeholder="Email Address"
								autoCompleteType="email"
								keyboardType="email-address"
								style={[styles.inputText, styles.modalResetInput]}
							/>
							<TouchableOpacity
								style={[styles.modalButton, styles.modalResetButton]}
								onPress={() => {
									resetPassword(modalResetText);
								}}
							>
								<Text style={styles.modalButtonText}>RESET PASSWORD</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
				{submitted && (
					<View style={styles.buttons}>
						<ActivityIndicator size="large" color={Colours.activityIndicator} />
					</View>
				)}
				{!submitted && (
					<View
						style={web ? [styles.buttons, styles.buttonsWeb] : [styles.buttons]}
					>
						<TextInput
							onChangeText={(val) => {
								setEmail(val);
							}}
							placeholder="Email Address"
							autoCompleteType="email"
							keyboardType="email-address"
							style={styles.inputText}
						/>
						<TextInput
							onChangeText={(val) => {
								setPassword(val);
							}}
							placeholder="Password"
							autoCompleteType="password"
							secureTextEntry={true}
							style={styles.inputText}
						/>
						<TouchableOpacity
							style={[styles.button, styles.loginButton]}
							onPress={() => {
								login(email, password);
							}}
						>
							<Text style={styles.buttonText}>LOGIN WITH EMAIL</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.button, styles.resetPasswordButton]}
							onPress={() => {
								resetPasswordDialog();
							}}
						>
							<Text style={styles.buttonText}>FORGOT PASSWORD</Text>
						</TouchableOpacity>
						<TouchableOpacity
							disabled={true}
							style={[styles.button, styles.fbButton, styles.disabledButton]}
							onPress={() => {
								setSubmitted(true);
								fbPromptAsync();
							}}
						>
							<Text style={styles.disabledText}>LOGIN WITH FACEBOOK</Text>
						</TouchableOpacity>
						<TouchableOpacity
							disabled={true}
							style={[
								styles.button,
								styles.googleButton,
								styles.disabledButton,
							]}
							onPress={() => {
								setSubmitted(true);
								gPromptAsync();
							}}
						>
							<Text style={styles.disabledText}>LOGIN WITH GOOGLE</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	},
	scroll: {
		height: Gui.screen.height,
		width: Gui.screen.width,
		backgroundColor: Gui.container.backgroundColor,
	},
	logo: {
		resizeMode: 'contain',
		top: Gui.screen.height * 0.1,
		width: Gui.screen.width * 0.6,
		height: Gui.screen.height * 0.3,
	},
	buttons: {
		top: Gui.screen.height * 0.15,
		height: Gui.screen.height * 0.6,
		width: Gui.screen.width * 0.75,
	},
	buttonsWeb: {
		height: Gui.screen.height * 0.5,
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.button.width,
		height: Gui.button.height,
		borderRadius: Gui.button.borderRadius,
		borderColor: Gui.button.borderColour,
		marginBottom: Gui.button.spacing,
	},
	fbButton: {
		backgroundColor: Colours.koha_navy,
		fontSize: Gui.button.fontSize * 0.8,
	},
	googleButton: {
		backgroundColor: Colours.koha_orange,
	},
	disabledButton: {
		backgroundColor: Colours.grey,
	},
	backButton: {
		backgroundColor: Colours.koha_lightblue,
	},
	buttonText: {
		textAlign: 'center',
		color: Gui.button.textColour,
		fontFamily: 'Volte',
	},
	disabledText: {
		textAlign: 'center',
		color: Gui.button.textColour,
		fontFamily: 'Volte',
		textDecorationLine: 'line-through',
	},
	inputText: {
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: Gui.screen.height * 0.03,
		marginBottom: Gui.screen.height * 0.01,
		width: Gui.button.width,
		height: Gui.button.height,
		color: Colours.default,
		borderRadius: Gui.button.borderRadius,
		borderWidth: 1,
		borderColor: Colours.default,
		fontFamily: 'Volte',
	},
	loginButton: {
		width: Gui.button.width * 0.65,
		backgroundColor: Colours.koha_purple,
		marginBottom: gui.screen.height * 0.05,
		fontSize: Gui.button.fontSize * 0.8,
	},
	resetPasswordButton: {
		fontSize: Gui.button.fontSize * 0.6,
		width: Gui.button.width * 0.325,
		backgroundColor: Colours.koha_navy,
		marginTop: -gui.screen.height * 0.12,
		marginBottom: gui.screen.height * 0.05,
		marginLeft: gui.screen.width * 0.505,
	},
	modalCenter: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalResetCenter: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: -Gui.screen.height * 1,
	},
	modalFullScreen: {
		width: Gui.screen.width * 1,
		height: Gui.screen.height * 1,
		backgroundColor: Colours.transparent,
		borderWidth: 0,
	},
	modalView: {
		backgroundColor: Colours.koha_background,
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.9,
		height: Gui.screen.height * 0.275,
		borderWidth: 5,
		borderRadius: 5,
		shadowColor: Colours.black,
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,
		elevation: 24,
	},
	modalResetView: {
		height: Gui.screen.height * 0.275,
	},
	modalViewText: {
		justifyContent: 'center',
		width: Gui.screen.width * 0.75,
		height: Gui.screen.height * 0.275 * 0.66,
		fontFamily: 'Volte',
	},
	modalText: {
		textAlign: 'center',
		fontSize: Gui.screen.height * 0.275 * 0.1,
		fontFamily: 'Volte',
	},
	modalResetTitle: {
		fontSize: Gui.screen.height * 0.275 * 0.125,
		fontFamily: 'Volte',
	},
	modalResetInput: {
		marginTop: Gui.screen.height * 0.01,
		fontFamily: 'Volte',
	},
	modalResetButton: {
		marginTop: Gui.screen.height * 0.005,
		width: Gui.screen.width * 0.75,
		fontFamily: 'Volte',
	},
	modalButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.5,
		height: Gui.button.height,
		borderRadius: Gui.button.borderRadius,
		backgroundColor: Colours.koha_navy,
		fontFamily: 'Volte',
	},
	modalButtonText: {
		fontSize: Gui.screen.height * 0.25 * 0.12,
		color: Colours.white,
		fontFamily: 'Volte',
	},
});

export default Login;
