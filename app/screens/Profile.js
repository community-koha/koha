import React, { useState } from 'react';
import Colours from '../config/colours.js';
import Gui from '../config/gui.js';
import Roles from '../config/roles.js';

import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	ActivityIndicator,
	NativeModules,
	ScrollView,
	TextInput,
	Platform,
	Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import firebase from 'firebase/app';
import 'firebase';
import gui from '../config/gui.js';

function Profile({ navigation }) {
	const [web, setWeb] = useState(Platform.OS == 'web');
	const [user, setUser] = useState(null);
	const [editing, setEditing] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalText, setModalText] = useState(false);
	const [modalResetVisible, setModalResetVisible] = useState(false);
	const [modalResetPassword, setModalResetPassword] = useState('');
	const [modalResetPasswordConfirm, setModalResetPasswordConfirm] =
		useState('');

	const [prefix, setPrefix] = useState('');
	const [originalName, setOriginalName] = useState('');
	const [name, setName] = useState('');
	const [originalEmail, setOriginalEmail] = useState('');
	const [email, setEmail] = useState('');

	const [isReady, setIsReady] = useState(false);
	const LoadFonts = async () => {
		await useFonts();
	};

	function saveInfo(name, email) {
		if (name != originalName) {
			if (name != '') {
				user
					.updateProfile({
						displayName: prefix + name,
					})
					.catch((error) => {
						console.error(error.code + ': ' + error.message);
						setModalText(error.message);
						setModalVisible(true);
						setSubmitted(false);
						return false;
					});

				var db = firebase.firestore();
				db.collection('users')
					.doc(user.uid)
					.set(
						{
							name: name,
						},
						{ merge: true }
					)
					.catch((error) => {
						console.error(error);
					});
			} else {
				setModalText("Your name can't be empty");
				setModalVisible(true);
				setSubmitted(false);
				return false;
			}
		}
		if (email != originalEmail) {
			user
				.verifyBeforeUpdateEmail(email)
				.then(() => {
					var db = firebase.firestore();
					db.collection('users')
						.doc(user.uid)
						.set(
							{
								email: email,
							},
							{ merge: true }
						)
						.catch((error) => {
							console.error(error);
						});
				})
				.catch((error) => {
					console.error(error.code + ': ' + error.message);
					if (error.code == 'auth/requires-recent-login') {
						error.message =
							'Changing your email requires recent authentication. Log out, then log back in before attempting to change your email.';
					}
					setEmail(originalEmail);
					setModalText(error.message);
					setModalVisible(true);
					setSubmitted(false);
					return false;
				});
			setModalText(
				'A verification email has been sent to ' +
					email +
					".\nOnce verified you'll be able to login with your new email."
			);
			setEmail(originalEmail);
			setModalVisible(true);
			setEditing(false);
			setSubmitted(false);
		} else {
			setModalText('Your information has been updated.');
			setModalVisible(true);
			setEditing(false);
			setSubmitted(false);
		}

		return true;
	}

	function changePassword(password, confirm) {
		if (password != confirm) {
			setModalText('Your new passwords do not match.');
			setModalVisible(true);
			setModalResetVisible(false);
			setModalResetPassword('');
			setModalResetPasswordConfirm('');
			return false;
		}

		user
			.updatePassword(password)
			.then(() => {
				setModalText('Your password has been updated.');
				setModalVisible(true);
			})
			.catch((error) => {
				console.error(error.code + ': ' + error.message);
				if (error.code == 'auth/requires-recent-login') {
					error.message =
						'Changing your password requires recent authentication. Log out, then log back in before attempting to change your password.';
				}
				setModalText(error.message);
				setModalVisible(true);
				return false;
			});

		setModalResetVisible(false);
		setModalResetPassword('');
		setModalResetPasswordConfirm('');
		return true;
	}

	var unsubscribe = process.env.JEST_WORKER_ID !== undefined? null: firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			unsubscribe();
			setUser(user);
			if (originalName == '') {
				setOriginalName(user.displayName.slice(2, 9999));
				setName(user.displayName.slice(2, 9999));
				setPrefix(user.displayName.slice(0, 2));
				setOriginalEmail(user.email);
				setEmail(user.email);
			}
		}
	});

	let icon = (
		<MaterialCommunityIcons
			name={editing ? 'content-save' : 'pencil'}
			size={Gui.screen.height * 0.035}
			color={Colours.default}
			style={web ? styles.headerIconWeb : styles.headerIcon}
		/>
	);
	if (process.env.JEST_WORKER_ID !== undefined) {
		icon = '';
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
			<View>
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
								Change Password
							</Text>
							<TextInput
								onChangeText={(val) => {
									setModalResetPassword(val);
								}}
								placeholder="New Password"
								style={[styles.infoText, styles.modalResetInput]}
								secureTextEntry={true}
							/>
							<TextInput
								onChangeText={(val) => {
									setModalResetPasswordConfirm(val);
								}}
								placeholder="Confirm Password"
								style={[styles.infoText, styles.modalResetInput]}
								secureTextEntry={true}
							/>
							<TouchableOpacity
								style={[styles.modalButton, styles.modalResetButton]}
								onPress={() =>
									changePassword(modalResetPassword, modalResetPasswordConfirm)
								}
							>
								<Text style={styles.modalButtonText}>CHANGE PASSWORD</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</View>
			{!user ||
				(submitted && (
					<View style={styles.loading}>
						<ActivityIndicator size="large" color={Colours.activityIndicator} />
					</View>
				))}
			{!submitted && user != null && !editing && (
				<View>
					<View style={styles.header}>
						<Text style={styles.headerTitle}>Account Information</Text>
						<TouchableOpacity
							style={([styles.button, styles.editButton], { zIndex: 100 })}
							onPress={() => {
								setEditing(true);
							}}
						>
							{icon}
						</TouchableOpacity>
					</View>
					<ScrollView style={styles.content}>
						<Text style={styles.infoTitle}>Display Name</Text>
						<TextInput
							value={name}
							placeholder="Display Name"
							autoCompleteType="name"
							editable={false}
							style={[styles.infoText, styles.hiddenBorder]}
						/>
						<Text style={styles.infoTitle}>Email Address</Text>
						<TextInput
							value={email}
							placeholder="Email Address"
							editable={false}
							style={[styles.infoText, styles.hiddenBorder]}
						/>
						<Text style={styles.infoTitle}>Account Type</Text>
						<TextInput
							value={
								user.displayName[0] == Roles.donateBusiness
									? 'Business'
									: 'Individual/Family'
							}
							placeholder="Account Type"
							editable={false}
							style={[styles.infoText, styles.hiddenBorder]}
						/>
						<Text style={styles.infoTitle}>Member Since</Text>
						<TextInput
							value={new Date(parseInt(user.metadata.a)).toLocaleString(
								'en-NZ',
								{ year: 'numeric', month: 'long' }
							)}
							placeholder="Member Since"
							editable={false}
							style={[styles.infoText, styles.hiddenBorder]}
						/>
						<Text style={styles.infoTitle}>Last Successful Login</Text>
						<TextInput
							value={new Date(parseInt(user.metadata.b)).toLocaleString(
								'en-NZ',
								{
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: 'numeric',
									minute: 'numeric',
								}
							)}
							placeholder="Last Successful Login"
							editable={false}
							style={[styles.infoText, styles.hiddenBorder]}
						/>
						<TouchableOpacity
							style={[styles.button, styles.emailButton]}
							onPress={() => setModalResetVisible(true)}
						>
							<Text style={styles.buttonText}>Change Password</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.button, styles.emailButton, styles.passwordButton]}
							onPress={() => {
								firebase.auth().signOut();
								navigation.navigate('Entry');
							}}
						>
							<Text style={styles.buttonText}>Logout</Text>
						</TouchableOpacity>
					</ScrollView>
				</View>
			)}
			{!submitted && user != null && editing && (
				<View>
					<View style={styles.header}>
						<Text style={styles.headerTitle}>Edit Account Info</Text>
					</View>
					<ScrollView style={styles.content}>
						<Text style={styles.infoTitle}>Display Name</Text>
						<TextInput
							onChangeText={(val) =>
								setName(val.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()|\\]/g, ''))
							}
							value={name}
							placeholder="Display Name"
							autoCompleteType="name"
							style={styles.infoText}
						/>
						<Text style={styles.infoTitle}>Email Address</Text>
						<TextInput
							onChangeText={(val) => setEmail(val)}
							value={email}
							placeholder="Email Address"
							keyboardType="email-address"
							style={styles.infoText}
						/>
						<TouchableOpacity
							style={[styles.button, styles.emailButton]}
							onPress={() => {
								saveInfo(name, email);
							}}
						>
							<Text style={styles.buttonText}>Save Changes</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.button, styles.emailButton, styles.passwordButton]}
							onPress={() => {
								setEditing(false);
								setName(originalName);
								setEmail(originalEmail);
							}}
						>
							<Text style={styles.buttonText}>Cancel Changes</Text>
						</TouchableOpacity>
					</ScrollView>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},

	loading: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		paddingTop: Platform.OS === 'ios' ? 50 : 0,
		paddingLeft: Gui.screen.width * 0.1,
		paddingRight: Gui.screen.width * 0.1,
		zIndex: 3,
		backgroundColor: Gui.container.backgroundColor,
		height: Gui.screen.height * 0.12,
		flexDirection: 'row',
		alignContent: 'space-between',
		alignItems: 'center',
	},
	content: {
		backgroundColor: Colours.white,
		height: '80%',
	},
	headerTitle: {
		alignItems: 'center',
		textAlign: 'center',
		textAlignVertical: 'center',
		fontFamily: 'Volte',
		fontSize: Gui.screen.height * 0.031,
		color: Colours.koha_purple,
	},
	button: {
		fontFamily: 'Volte',
		fontSize: Gui.screen.height * 0.025,
		marginRight: Gui.screen.width * 0.2,
		borderColor: Colours.default,
		borderRadius: 3,
		borderWidth: 0,
		marginBottom: Gui.screen.width * 0.2,
	},
	editButton: {
		borderColor: Colours.default,
		marginRight: Gui.screen.width * 0,
		width: Gui.screen.width * 0.14,
		borderRadius: 3,
		borderWidth: 0,
		borderColor: Colours.default,
		backgroundColor: Colours.transparent,
		borderWidth: 0,
	},
	headerIconWeb: {
		marginLeft: Gui.screen.width * 0,
		height: Gui.screen.height * 0.035,
	},
	headerIcon: {
		marginLeft: Gui.screen.width * 0,
		height: Gui.screen.height * 0.035,
	},
	spacer: {
		marginLeft: Gui.screen.width * 0.025,
		height: Gui.screen.height * 0,
		width: Gui.screen.width * 0.95,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: Colours.grey,
	},
	contentSpacer: {
		marginTop: Gui.screen.width * 0.01,
		marginBottom: Gui.screen.width * 0.01,
		borderWidth: 0,
	},
	infoTitle: {
		textAlign: 'left',
		textAlignVertical: 'top',
		fontFamily: 'Volte',
		marginTop: Gui.screen.height * 0.02,
		marginLeft: Gui.screen.width * 0.1,
		fontSize: Gui.screen.height * 0.025,
		height: Gui.screen.height * 0.03,
		width: Gui.screen.width * 0.8,
		color: Colours.default,
	},
	infoText: {
		textAlign: 'left',
		textAlignVertical: 'center',
		marginTop: Gui.screen.height * 0.005,
		marginLeft: Gui.screen.width * 0.1,
		fontSize: Gui.screen.height * 0.03,
		height: Gui.screen.height * 0.05,
		width: Gui.screen.width * 0.8,
		color: Colours.default,
		borderRadius: 3,
		borderWidth: 1,
		borderColor: Colours.default,
		fontFamily: 'Volte',
	},
	hiddenBorder: {
		borderWidth: 0,
	},

	emailButton: {
		marginTop: Gui.screen.height * 0.02,
		marginBottom: Gui.screen.height * 0.02,
		marginLeft: Gui.screen.width * 0.1,
		width: Gui.screen.width * 0.8,
		height: Gui.screen.height * 0.05,
		backgroundColor: Colours.koha_purple,
		padding: 12,
		borderRadius: 10,
		alignItems: 'center',
	},
	passwordButton: {
		marginTop: 0,
	},
	buttonText: {
		fontSize: Gui.screen.height * 0.02,
		fontFamily: 'Volte',
		color: Colours.white,
		borderRadius: 10,
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
		fontFamily: 'Volte',
		fontSize: Gui.screen.height * 0.275 * 0.1,
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
	modalResetView: {
		height: Gui.screen.height * 0.35,
	},
	modalResetTitle: {
		fontSize: Gui.screen.height * 0.275 * 0.125,
	},
	modalResetInput: {
		marginTop: Gui.screen.height * 0.275 * 0.1,
		marginLeft: 0,
		width: Gui.screen.width * 0.65,
	},
	modalResetButton: {
		marginTop: Gui.screen.height * 0.275 * 0.05,
		width: Gui.screen.width * 0.65,
	},
	modalButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.5,
		height: Gui.button.height,
		borderRadius: Gui.button.borderRadius,
		backgroundColor: Colours.koha_purple,
	},
	modalButtonText: {
		fontSize: Gui.screen.height * 0.25 * 0.12,
		color: Colours.white,
		fontFamily: 'Volte',
	},
});

export default Profile;
