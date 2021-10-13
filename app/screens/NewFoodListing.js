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
import { FormStyle } from '../config/styles.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { LogBox } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Colours from '../config/colours.js';
import API from '../config/api.js';

import firebase from 'firebase/app';

function NewFoodListing({ navigation }) {
	// This warning can be ignored since our lists are small
	useEffect(() => {
		LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
	}, []);

	const [web, _0] = useState(Platform.OS === 'web');
	const userID = firebase.auth().currentUser.uid;
	const [listingType, _1] = useState('food');
	const [listingTitle, setListingTitle] = useState(null);
	const [description, setDescription] = useState(null);
	const [location, setLocation] = useState({ lat: 0, lng: 0, name: '' });
	const [category, setCategory] = useState(null);
	const [allergen, setAllergen] = useState(null);
	const [quantity, setQuantity] = useState(null);
	const [expiryDate, setExpiryDate] = useState(ConvertDate(Date.now()));
	const [collectionMethod, setCollectionMethod] = useState(null);
	const [imageFileName, setimageFileName] = useState(null);
	const [success, setSuccess] = useState(false);

	const [showDate, setShowDate] = useState(false);
	const [openCategoryType, setOpenCategoryType] = useState(false);
	const [openAllergenType, setOpenAllergenType] = useState(false);
	const [openCollectionType, setOpenCollectionType] = useState(false);

	const [categoryFood, _2] = useState([
		{ value: 'fruit', label: 'Fruit' },
		{ value: 'vegetables', label: 'Vegetables' },
		{ value: 'dry_goods', label: 'Dry Goods' },
		{ value: 'cooked', label: 'Cooked Meals' },
		{ value: 'bakery', label: 'Bakery Items' },
		{ value: 'dairy', label: 'Dairy' },
		{ value: 'misc', label: 'Miscellaneous' },
	]);

	const [categoryAllergen, _3] = useState([
		{ value: 'gluten', label: 'Gluten' },
		{ value: 'peanuts', label: 'Peanuts' },
		{ value: 'seafood', label: 'Seafood' },
		{ value: 'dairy', label: 'Dairy' },
		{ value: 'eggs', label: 'Eggs' },
	]);

	const [collectionItems, _4] = useState([
		{ value: 'pick_up', label: 'Pick Up' },
		{ value: 'delivery', label: 'Delivery' },
	]);

	function categoryOpened(val) {
		setOpenCategoryType(val);
		setOpenAllergenType(false);
		setOpenCollectionType(false);
	}
	function allergenOpened(val) {
		setOpenCategoryType(false);
		setOpenAllergenType(val);
		setOpenCollectionType(false);
	}
	function collectionOpened(val) {
		setOpenCategoryType(false);
		setOpenAllergenType(false);
		setOpenCollectionType(val);
	}

	function setDate(date) {
		setShowDate(false);
		setExpiryDate(date);
	}

	function ConvertDate(seconds) {
		if (seconds == null) {
			seconds = Date.now();
		}
		var local = new Date(seconds);
		var date = new Date(local.getTime());
		return (
			(date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
			'/' +
			(date.getMonth() + 1 < 10
				? '0' + (date.getMonth() + 1)
				: date.getMonth() + 1) +
			'/' +
			date.getFullYear()
		);
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
		allergen,
		quantity,
		expiryDate,
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
				[
					'fruit',
					'vegetables',
					'dry_goods',
					'cooked',
					'bakery',
					'dairy',
					'misc',
				]:
				return false;

			case !allergen in ['gluten', 'peanuts', 'seafood', 'dairy', 'eggs']:
				return false;

			case quantity == null || quantity <= 0:
				return false;

			case expiryDate == null:
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
			allergen,
			quantity,
			expiryDate,
			collectionMethod,
			imageFileName
		);
	}

	function ShowSuccess() {
		return (
			<View style={styles.message}>
				<Text style={{ color: Colours.white, fontSize: 20 }}>
					Success! New food listing has been created.
				</Text>
			</View>
		);
	}

	function ClearInput() {
		setListingTitle(null);
		setDescription(null);
		setLocation({ lat: 0, lng: 0, name: '' });
		setCategory(null);
		setAllergen(null);
		setQuantity(null);
		setExpiryDate(ConvertDate(Date.now()));
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
		allergen,
		quantity,
		expiryDate,
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
			allergen: allergen,
			quantity: quantity,
			expiryDate: expiryDate,
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

	return (
		<View style={styles.container} keyboardShouldPersistTaps="always">
			<StatusBar backgroundColor={Colours.white} barStyle="dark-content" />
			{success ? ShowSuccess() : <View></View>}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>New Food Listing</Text>
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
					items={categoryFood}
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
				<Text style={styles.inputTitle}>Allergen</Text>
				<DropDownPicker
					open={openAllergenType}
					items={categoryAllergen}
					value={allergen}
					setOpen={(val) => allergenOpened(val)}
					setValue={(val) => setAllergen(val)}
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
				<Text style={styles.inputTitle}>Expiry Date</Text>
				{web && (
					<DatePicker
						selected={new Date(Date.now())}
						onChange={(val) => setDate(ConvertDate(val))}
						minDate={Date.now()}
						dateFormat="dd/MM/yyyy"
						zIndex={9000}
						customInput={
							<TouchableOpacity
								style={styles.date}
								onPress={() => setShowDate(true)}
							>
								<Text style={styles.dateText}>{expiryDate}</Text>
							</TouchableOpacity>
						}
					/>
				)}
				{!web && (
					<TouchableOpacity
						style={styles.date}
						onPress={() => setShowDate(true)}
					>
						<Text style={styles.dateText}>{expiryDate}</Text>
					</TouchableOpacity>
				)}
				{!web && showDate && (
					<DateTimePicker
						mode="date"
						dateFormat="day month year"
						minimumDate={Date.now()}
						value={new Date(Date.now())}
						onChange={(val) =>
							setDate(ConvertDate(val['nativeEvent']['timestamp']))
						}
					/>
				)}
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
							allergen,
							quantity,
							expiryDate,
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

export default NewFoodListing;
