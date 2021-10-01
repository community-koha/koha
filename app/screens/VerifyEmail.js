import React, { useState } from 'react';

import Colours from '../config/colours.js';
import Gui from '../config/gui.js';

import {
	View,
	StyleSheet,
	Text,
	StatusBar,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase/app';

function VerifyEmail({ navigation }) {
	const [email, setEmail] = useState('');
	const [web, setWeb] = useState(true);
	const [user, setUser] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalText, setModalText] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [buttonDisabled, setButtonDisabled] = useState(false);

	var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			console.log(user.email + ' - ' + user.emailVerified);
			setUser(user);
			setEmail(user.email);

			var id = setInterval(() => {
				if (user.emailVerified) {
					console.log('User has verified their email.');
					navigation.navigate('UserType');
					clearInterval(id);
					unsubscribe();
				} else {
					user.reload();
				}
			}, 1000);
		}
	});

	function resendEmail() {
		user.sendEmailVerification().catch((error) => {
			console.log(error.code + ': ' + error.message);
			setModalText(error.message);
			setModalVisible(true);
		});

		setModalText(
			"The verification email has been sent, make sure to check your spam inbox.\nYou'll be able to request a new verification email in 60 seconds."
		);
		setModalVisible(true);

		// Block the resend button for a minute
		setButtonDisabled(true);
		var id = setInterval(() => {
			setButtonDisabled(false);
			clearInterval(id);
		}, 60 * 1000);
	}

	let icon = (
		<MaterialCommunityIcons
			name="arrow-left"
			size={Gui.screen.height * 0.05}
			color={Colours.default}
			style={styles.headerIcon}
		/>
	);
	if (process.env.JEST_WORKER_ID !== undefined) {
		icon = '';
	}

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor={Colours.white} barStyle="dark-content" />
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
			<View>
				<Text style={web ? styles.headerTextWeb : styles.headerText}>
					VERIFY EMAIL
				</Text>
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('Entry');
						firebase
							.auth()
							.signOut()
							.catch((error) => {
								console.error(error.code + ': ' + error.message);

								error.message = 'Failed to sign out';

								setModalText(error.message);
								setModalVisible(true);
							});
					}}
					style={styles.backButton}
				>
					{icon}
				</TouchableOpacity>
			</View>
			<ScrollView style={styles.scroll}>
				<Text style={styles.mainText}>
					We've sent an email to <Text style={styles.emailText}>{email}</Text>.
					Follow the instructions in the email to verify your email address,
					activate your account, and enable your access to the application.
					<br />
					<br />
					If you haven't received an email from us, click the button below to
					resend the verification email.
				</Text>
				{submitted && (
					<View style={styles.buttons}>
						<ActivityIndicator
							size="large"
							color={Colours.activityIndicator}
							style={[styles.resend, styles.hideBorder]}
						/>
					</View>
				)}
				{!submitted && (
					<TouchableOpacity
						style={styles.resend}
						disabled={buttonDisabled}
						onPress={() => {
							setSubmitted(true);
							resendEmail();
						}}
					>
						<Text style={styles.emailText}>RESEND VERIFICATION EMAIL</Text>
					</TouchableOpacity>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Gui.container.backgroundColor,
		flexDirection: 'column',
	},
	header: {
		flex: 1,
		backgroundColor: Gui.container.backgroundColor,
		flexDirection: 'row',
		height: 0,
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: -Gui.screen.height * 0.05,
		marginBottom: Gui.screen.height * 0.02,
		height: Gui.screen.height * 0.08,
		width: Gui.screen.width * 0.2,
	},
	scroll: {
		textAlign: 'center',
		textAlignVertical: 'center',
		marginTop: Gui.screen.height * 0.15,
	},
	headerIcon: {
		marginTop: -Gui.screen.height * 0.025,
		marginLeft: Gui.screen.width * 0.05,
		height: Gui.screen.height * 0.05,
	},
	headerText: {
		textAlign: 'center',
		textAlignVertical: 'center',
		top: Gui.screen.height * 0.02,
		marginLeft: Gui.screen.width * 0,
		fontSize: Gui.screen.height * 0.03,
		height: Gui.screen.height * 0.05,
		width: Gui.screen.width * 0.95,
		fontWeight: 'bold',
		flexDirection: 'row',
		alignItems: 'center',
	},
	headerTextWeb: {
		textAlign: 'center',
		textAlignVertical: 'center',
		marginTop: Gui.screen.height * 0.04,
		fontSize: Gui.screen.height * 0.03,
		height: Gui.screen.height * 0.05,
		width: Gui.screen.width * 1,
		fontWeight: 'bold',
		flexDirection: 'row',
		alignItems: 'center',
	},
	mainText: {
		textAlign: 'center',
		textAlignVertical: 'center',
		marginTop: Gui.screen.height * 0.025,
		marginLeft: Gui.screen.width * 0.25,
		fontSize: Gui.screen.height * 0.025,
		width: Gui.screen.width * 0.5,
		color: Colours.default,
	},
	email: {
		textAlign: 'center',
		textAlignVertical: 'center',
		marginTop: Gui.screen.height * 0.025,
		marginLeft: Gui.screen.width * 0.25,
		fontSize: Gui.screen.height * 0.025,
		height: Gui.screen.height * 0.03,
		width: Gui.screen.width * 0.5,
		color: Colours.default,
	},
	resend: {
		marginLeft: Gui.screen.width * 0.25,
		marginTop: Gui.screen.height * 0.1,
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.5,
		height: Gui.screen.height * 0.075,
		borderRadius: 3,
		borderWidth: 1,
		borderColor: Colours.default,
	},
	emailText: {
		fontSize: Gui.screen.height * 0.023,
		fontWeight: 'bold',
	},
	hideBorder: {
		borderWidth: 0,
	},
	modalCenter: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		backgroundColor: Colours.white,
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
	modalViewText: {
		justifyContent: 'center',
		width: Gui.screen.width * 0.75,
		height: Gui.screen.height * 0.275 * 0.66,
	},
	modalText: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: Gui.screen.height * 0.275 * 0.1,
	},
	modalButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.5,
		height: Gui.button.height,
		borderRadius: Gui.button.borderRadius,
		borderWidth: 2,
		borderColor: Colours.koha_navy,
		backgroundColor: Colours.koha_navy,
	},
	modalButtonText: {
		fontSize: Gui.screen.height * 0.25 * 0.12,
		color: Colours.white,
		fontWeight: 'bold',
	},
});

export default VerifyEmail;
