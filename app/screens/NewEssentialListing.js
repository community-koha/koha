import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StatusBar,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Platform,
	Image,
	ActivityIndicator,
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { LogBox } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Colours from '../config/colours.js';
import { FormStyle } from '../config/styles.js';
import API from '../config/api.js';

import AppLoading from 'expo-app-loading';

import firebase from 'firebase/app';

function NewEssentialListing({ navigation }) {
	// This warning can be ignored since our lists are small
	useEffect(() => {
		LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
	}, []);

	const [web, setWeb] = useState(Platform.OS === 'web');
	const userID = process.env.JEST_WORKER_ID !== undefined? "": firebase.auth().currentUser.uid;
	const [listingType, setlistingType] = useState('essentialItem');
	const [listingTitle, setListingTitle] = useState(null);
	const [description, setDescription] = useState(null);
	const [location, setLocation] = useState({ lat: 0, lng: 0, name: '' });
	const [category, setCategory] = useState(null);
	const [condition, setCondition] = useState(null);
	const [quantity, setQuantity] = useState(null);
	const [collectionMethod, setCollectionMethod] = useState(null);
	const [imageFileName, setimageFileName] = useState(null);
	const [success, setSuccess] = useState(false);

	const [openCategoryType, setOpenCategoryType] = useState(false);
	const [openConditionType, setOpenConditionType] = useState(false);
	const [openCollectionType, setOpenCollectionType] = useState(false);

	const [categoryItems, setCategoryItems] = useState([
		{ value: 'baby', label: 'Baby Items' },
		{ value: 'household', label: 'Household Essentials' },
		{ value: 'toiletries', label: 'Toiletries' },
		{ value: 'school', label: 'School Items' },
		{ value: 'clothing', label: 'Clothing' },
		{ value: 'misc', label: 'Miscellaneous' },
	]);

	const [categoryCondition, setCategoryCondition] = useState([
		{ value: 'new', label: 'New' },
		{ value: 'used', label: 'Used' },
	]);

	const [collectionItems, setCollectionItems] = useState([
		{ value: 'pick_up', label: 'Pick Up' },
		{ value: 'delivery', label: 'Delivery' },
	]);

	const [isReady, setIsReady] = useState(false);
	const LoadFonts = async () => {
		await useFonts();
	};

	function categoryOpened(val) {
		setOpenCategoryType(val);
		setOpenConditionType(false);
		setOpenCollectionType(false);
	}
	function conditionOpened(val) {
		setOpenCategoryType(false);
		setOpenConditionType(val);
		setOpenCollectionType(false);
	}
	function collectionOpened(val) {
		setOpenCategoryType(false);
		setOpenConditionType(false);
		setOpenCollectionType(val);
	}

	function GoBack() {
		// Go back to the map page
		navigation.goBack();
	}

	function CheckInput(
		listingTitle,
		description,
		location,
		category,
		condition,
		quantity,
		collectionMethod,
		imageFileName
	) {
		console.log('');
		console.log('Checking');
		switch (true) {
			case listingTitle in ['', null]:
				return false;

			case description in ['', null]:
				return false;

			case location['lat'] == 0 || location['lng'] == 0:
				return false;

			case !category in
				['baby', 'household', 'toiletries', 'school', 'clothing', 'misc']:
				return false;

			case !condition in ['new', 'used']:
				return false;

			case quantity == null || quantity <= 0:
				return false;

			case !collectionMethod in ['pick_up', 'delivery']:
				return false;

			case imageFileName in ['', null]:
				return false;
		}

		console.log('Pass');

		SubmitForm(
			userID,
			listingType,
			listingTitle,
			description,
			location,
			category,
			condition,
			quantity,
			collectionMethod,
			imageFileName
		);
	}

	function ShowSuccess() {
		return (
			<View style={styles.message}>
				<Text
					style={{ color: Colours.white, fontSize: 20, fontFamily: 'Volte' }}
				>
					Success! New essential item listing has been created.
				</Text>
			</View>
		);
	}

	function ClearInput() {
		setListingTitle(null);
		setDescription(null);
		setLocation({ lat: 0, lng: 0, name: '' });
		setCategory(null);
		setCondition(null);
		setQuantity(null);
		setCollectionMethod(null);
		setimageFileName(null);
	}

	function SubmitForm(
		userID,
		listingType,
		listingTitle,
		description,
		location,
		category,
		condition,
		quantity,
		collectionMethod,
		imageFileName
	) {
		const dbh = firebase.firestore();

		dbh.collection('listings').add({
			user: dbh.doc('users/' + userID),
			listingType: listingType,
			listingTitle: listingTitle,
			description: description,
			location: location,
			category: category,
			condition: condition,
			quantity: quantity,
			collectionMethod: collectionMethod,
			imageFileName: imageFileName,
		});

		ClearInput();
		setSuccess(true);
	}

	const [image, setImage] = useState(null);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				const { status } =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					alert('Sorry, we need camera roll permissions to make this work!');
				}
			}
		})();
	}, []);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	const uploadImage = async () => {
		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function () {
				reject(new TypeError('Network request failed'));
			};
			xhr.responseType = 'blob';
			xhr.open('GET', image, true);
			xhr.send(null);
		});

		const ref = firebase.storage().ref().child(new Date().toISOString());
		const snapshot = ref.put(blob);

		snapshot.on(
			firebase.storage.TaskEvent.STATE_CHANGED,
			() => {
				setUploading(true);
			},

			(error) => {
				setUploading(false);
				console.log(error);
				blob.close;
				return;
			},

			() => {
				snapshot.snapshot.ref.getMetadata().then((data) => {
					setimageFileName(data.name);
					setUploading(false);
					console.log('Upload successful');
					console.log('Filename', data.name);
					blob.close;
					return data;
				});
			}
		);
	};

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
		<View style={styles.container} keyboardShouldPersistTaps="always">
			<StatusBar backgroundColor={Colours.white} barStyle="dark-content" />
			{success ? ShowSuccess() : <View></View>}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>New Essential Listing</Text>
			</View>
			<ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
				<Text style={styles.inputTitle}>Title</Text>
				<TextInput
					value={listingTitle}
					onChangeText={(val) => setListingTitle(val)}
					placeholder="Title"
					style={styles.inputText}
				/>
				<Text style={styles.inputTitle}>Description</Text>
				<TextInput
					value={description}
					onChangeText={(val) => setDescription(val)}
					placeholder="Description"
					multiline={true}
					numberOfLines={3}
					textBreakStrategy={'simple'}
					style={styles.inputTextDescription}
				/>
				<Text style={styles.inputTitle}>Location</Text>
				<GooglePlacesAutocomplete
					placeholder="Search..."
					value={location}
					onFail={(error) => console.error(error)}
					fetchDetails={true}
					onFail={(data, details) => console.error(data, details)}
					onNotFound={(data, details) => console.error(data, details)}
					onPress={(data, details) =>
						setLocation({
							lat: details['geometry']['location']['lat'],
							lng: details['geometry']['location']['lng'],
							name: data['description'],
						})
					}
					query={{
						key: API.google_map,
						language: 'en',
						components: 'country:nz',
					}}
					requestUrl={{
						useOnPlatform: 'web',
						url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api', // or any proxy server that hits https://maps.googleapis.com/maps/api
					}}
					styles={{
						textInputContainer: styles.textInputContainer,
						textInput: styles.textInput,
						listView: styles.listView,
					}}
					zIndex={8000}
					debounce={200}
				/>
				<Text style={styles.inputTitle}>Category</Text>
				<DropDownPicker
					open={openCategoryType}
					items={categoryItems}
					value={category}
					setOpen={(val) => categoryOpened(val)}
					setValue={(val) => setCategory(val)}
					showArrowIcon={!web}
					showTickIcon={false}
					zIndex={5000}
					placeholder="Select..."
					placeholderStyle={styles.dropDownPlaceholderText}
					dropDownContainerStyle={styles.dropDownBody}
					textStyle={styles.dropDownText}
					style={styles.inputText}
				/>
				<Text style={styles.inputTitle}>Condition</Text>
				<DropDownPicker
					open={openConditionType}
					items={categoryCondition}
					value={condition}
					setOpen={(val) => conditionOpened(val)}
					setValue={(val) => setCondition(val)}
					showArrowIcon={!web}
					showTickIcon={false}
					zIndex={3000}
					placeholder="Select..."
					placeholderStyle={styles.dropDownPlaceholderText}
					dropDownContainerStyle={styles.dropDownBody}
					textStyle={styles.dropDownText}
					style={styles.inputText}
				/>
				<Text style={styles.inputTitle}>Quantity</Text>
				<TextInput
					value={quantity}
					onChangeText={(val) => setQuantity(val.replace(/\D/, ''))}
					placeholder="Quantity"
					keyboardType="numeric"
					returnKeyType="done"
					style={styles.inputText}
				/>

				<Text style={styles.inputTitle}>Collection Method</Text>
				<DropDownPicker
					open={openCollectionType}
					items={collectionItems}
					value={collectionMethod}
					setOpen={(val) => collectionOpened(val)}
					setValue={(val) => setCollectionMethod(val)}
					showArrowIcon={!web}
					showTickIcon={false}
					zIndex={1000}
					placeholder="Select..."
					placeholderStyle={styles.dropDownPlaceholderText}
					dropDownContainerStyle={styles.dropDownBody}
					textStyle={styles.dropDownText}
					style={styles.inputText}
				/>

				<TouchableOpacity style={styles.cancel} onPress={pickImage}>
					<Text style={styles.cancelText}>1. Select Photo</Text>
				</TouchableOpacity>
				{image && (
					<Image
						source={{ uri: image }}
						style={{ marginLeft: 40, width: 100, height: 100 }}
					/>
				)}

				{!uploading ? (
					<TouchableOpacity style={styles.cancel} onPress={uploadImage}>
						<Text style={styles.cancelText}>2. Upload</Text>
					</TouchableOpacity>
				) : (
					<ActivityIndicator size="large" color="#000" />
				)}

				<TouchableOpacity
					style={styles.submit}
					onPress={() =>
						CheckInput(
							listingTitle,
							description,
							location,
							category,
							condition,
							quantity,
							collectionMethod,
							imageFileName
						)
					}
				>
					<Text style={styles.submitText}>CREATE LISTING</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.cancel} onPress={() => GoBack()}>
					<Text style={styles.cancelText}>CANCEL</Text>
				</TouchableOpacity>
				<View style={styles.end} />
			</ScrollView>
		</View>
	);
}

const styles = FormStyle();

export default NewEssentialListing;
