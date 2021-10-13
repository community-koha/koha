import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ActivityIndicator,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Platform,
	StatusBar,
	Modal,
} from 'react-native';
import Colours from '../config/colours.js';
import Gui from '../config/gui.js';
import firebase from 'firebase/app';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import API from '../config/api.js';
import { FormStyle } from '../config/styles.js';

function EditListingScreen({ route, navigation }) {
	const [web, setWeb] = useState(Platform.OS === 'web');
	const [listingId, setListingId] = useState(route.params.listingId);
	const [loading, setLoading] = useState(true);
	const [listing, setListing] = useState(null);
	const [type, setType] = useState('');

	const [showDate, setShowDate] = useState(false);
	const [openCategoryType, setOpenCategoryType] = useState(false);
	const [openAllergenType, setOpenAllergenType] = useState(false);
	const [openCollectionType, setOpenCollectionType] = useState(false);
	const [openConditionType, setOpenConditionType] = useState(false);

	const [modalDelete, setModalDeleteVisible] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalText, setModalText] = useState(false);
	const [modalRedirect, setModalRedirect] = useState(false);

	// All listings
	const [listingTitle, setListingTitle] = useState(null);
	const [listingTitleOriginal, setListingTitleOriginal] = useState(null);
	const [description, setDescription] = useState(null);
	const [location, setLocation] = useState({ lat: 0, lng: 0, name: '' });
	const [locationOriginal, setLocationOriginal] = useState(null);
	const [category, setCategory] = useState(null);
	const [quantity, setQuantity] = useState(null);
	const [expiryDate, setExpiryDate] = useState(ConvertDate(Date.now()));
	const [eventDate, setEventDate] = useState(ConvertDate(Date.now()));

	// Food
	const [allergen, setAllergen] = useState(null);
	const [collectionMethod, setCollectionMethod] = useState(null);
	const [imageFileName, setimageFileName] = useState(null);

	// Items
	const [condition, setCondition] = useState(null);

	// Events
	const [capacity, setCapacity] = useState(null);

	const [categoryFood, setCategoryFood] = useState([
		{ value: 'fruit', label: 'Fruit' },
		{ value: 'vegetables', label: 'Vegetables' },
		{ value: 'dry_goods', label: 'Dry Goods' },
		{ value: 'cooked', label: 'Cooked Meals' },
		{ value: 'bakery', label: 'Bakery Items' },
		{ value: 'dairy', label: 'Dairy' },
		{ value: 'misc', label: 'Miscellaneous' },
	]);

	const [categoryAllergen, setCategoryAllergen] = useState([
		{ value: 'gluten', label: 'Gluten' },
		{ value: 'peanuts', label: 'Peanuts' },
		{ value: 'seafood', label: 'Seafood' },
		{ value: 'dairy', label: 'Dairy' },
		{ value: 'eggs', label: 'Eggs' },
	]);

	const [collectionItems, setCollectionItems] = useState([
		{ value: 'pick_up', label: 'Pick Up' },
		{ value: 'delivery', label: 'Delivery' },
	]);

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

	const [categoryService, setCategoryService] = useState([
		{ value: 'community', label: 'Community' },
		{ value: 'domestic', label: 'Domestic' },
		{ value: 'trades', label: 'Trades' },
		{ value: 'health', label: 'Health' },
		{ value: 'events', label: 'Events' },
		{ value: 'other', label: 'Other' },
	]);

	function categoryOpened(val) {
		setOpenCategoryType(val);
		setOpenAllergenType(false);
		setOpenCollectionType(false);
		setOpenConditionType(false);
		setOpenCollectionType(false);
	}
	function allergenOpened(val) {
		setOpenCategoryType(false);
		setOpenAllergenType(val);
		setOpenCollectionType(false);
		setOpenConditionType(false);
		setOpenCollectionType(false);
	}
	function collectionOpened(val) {
		setOpenCategoryType(false);
		setOpenAllergenType(false);
		setOpenCollectionType(val);
		setOpenConditionType(false);
	}
	function conditionOpened(val) {
		setOpenCategoryType(false);
		setOpenAllergenType(false);
		setOpenCollectionType(false);
		setOpenConditionType(val);
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

	function deleteListing() {
		const db = firebase.firestore();

		// Sets the delete field and then notifies the user
		db.collection('listings')
			.doc(listingId)
			.update({
				deleted: true,
				public: false,
			})
			.then(() => {
				setModalText('The listing has been deleted.');
				setModalVisible(true);
				setModalRedirect(true);
			})
			.catch((error) => {
				console.error(error);
				setModalText(error.message);
				setModalVisible(true);
			});

		// Add a notifiction for all the users watching the listing
		var subscriber = db
			.collection('users')
			.where('watching', 'array-contains', listingId)
			.onSnapshot((querySnapshot) => {
				subscriber();
				const watching_users = [];
				const push_tokens = [];

				querySnapshot.forEach((documentSnapshot) => {
					watching_users.push(documentSnapshot.data()['uid']);
					push_tokens.push(documentSnapshot.data()['notificationToken']);
				});

				console.log(watching_users);
				console.log(watching_users.length);

				watching_users.forEach((id) => {
					console.log(id);
					// Remove listing ID from users watching the listing
					db.collection('users')
						.doc(id)
						.update({
							watching: firebase.firestore.FieldValue.arrayRemove(listingId),
						})
						.then(() => {
							console.log('Removed item from watching list');
						})
						.catch((error) => {
							console.error(error);
						});

					// Add notifications for the users
					db.collection('notifications')
						.doc()
						.set(
							{
								uid: user['uid'],
								title: listingTitleOriginal,
								reason: 'removed',
							},
							{ merge: true }
						)
						.then(() => {
							console.log('Added notification to database');
						})
						.catch((error) => {
							console.error(error);
						});
				});

				// Send push notifications
				push_tokens.forEach((token) => {
					console.log(token);

					if (token !== null && token !== '') {
						sendPushNotification(
							token,
							'A watched listing has been removed.',
							"Your watched listing '" +
								listingTitleOriginal +
								"' has been removed by the poster. This listing will no longer appear in your watched listings."
						);
						console.log('Sent notification');
					}
				});
			});
	}

	function updateListing() {
		const db = firebase.firestore();

		switch (type) {
			case 'food': {
				switch (true) {
					case listingTitle === '':
						setModalText('Please enter a title for your listing');
						setModalVisible(true);
						return false;

					case description === '':
						setModalText('Please enter a description for your listing');
						setModalVisible(true);
						return false;

					case location['lat'] == 0 || location['lng'] == 0:
						setModalText('Please enter a location for your listing');
						setModalVisible(true);
						return false;

					case quantity == null || quantity <= 0:
						setModalText('Please enter a quantity for your listing');
						setModalVisible(true);
						return false;

					case expiryDate == null:
						setModalText('Please enter an expiry date for your listing');
						setModalVisible(true);
						return false;

					case !collectionMethod in ['pick_up', 'delivery']:
						setModalText('Please enter a collection method for your listing');
						setModalVisible(true);
						return false;
				}

				db.collection('listings')
					.doc(listingId)
					.set(
						{
							listingTitle: listingTitle,
							description: description,
							location: location,
							allergen: allergen,
							quantity: quantity,
							expiryDate: expiryDate,
							collectionMethod: collectionMethod,
							edited: true,
						},
						{ merge: true }
					)
					.then(() => {
						setModalText('The listing has been updated.');
						setModalVisible(true);
						setModalRedirect(true);
					})
					.catch((error) => {
						console.error(error);
						setModalText(error.message);
						setModalVisible(true);
					});
				break;
			}
			case 'essentialItem': {
				switch (true) {
					case listingTitle === '':
						setModalText('Please enter a title for your listing');
						setModalVisible(true);
						return false;

					case description === '':
						setModalText('Please enter a description for your listing');
						setModalVisible(true);
						return false;

					case location['lat'] == 0 || location['lng'] == 0:
						setModalText('Please enter a location for your listing');
						setModalVisible(true);
						return false;

					case quantity == null || quantity <= 0:
						setModalText('Please enter a quantity for your listing');
						setModalVisible(true);
						return false;

					case !category in
						['baby', 'household', 'toiletries', 'school', 'clothing', 'misc']:
						setModalText('Please enter a category for your listing');
						setModalVisible(true);
						return false;

					case !condition in ['new', 'used']:
						setModalText('Please enter an item condition for your listing');
						setModalVisible(true);
						return false;

					case !collectionMethod in ['pick_up', 'delivery']:
						setModalText('Please enter a collection method for your listing');
						setModalVisible(true);
						return false;
				}

				db.collection('listings')
					.doc(listingId)
					.set(
						{
							listingTitle: listingTitle,
							description: description,
							location: location,
							condition: condition,
							quantity: quantity,
							expiryDate: expiryDate,
							collectionMethod: collectionMethod,
							edited: true,
						},
						{ merge: true }
					)
					.then(() => {
						setModalText('The listing has been updated.');
						setModalVisible(true);
						setModalRedirect(true);
					})
					.catch((error) => {
						console.error(error);
						setModalText(error.message);
						setModalVisible(true);
					});
				break;
			}
			case 'event': {
				switch (true) {
					case listingTitle === '':
						setModalText('Please enter a title for your event');
						setModalVisible(true);
						return false;

					case description === '':
						setModalText('Please enter a description for your event');
						setModalVisible(true);
						return false;

					case location['lat'] == 0 || location['lng'] == 0:
						setModalText('Please enter a location for your event');
						setModalVisible(true);
						return false;

					case capacity == null || capacity <= 0:
						setModalText('Please enter a capacity for your event');
						setModalVisible(true);
						return false;

					case eventDate == null:
						setModalText('Please enter a date for your event');
						setModalVisible(true);
						return false;
				}

				db.collection('listings')
					.doc(listingId)
					.set(
						{
							listingTitle: listingTitle,
							description: description,
							location: location,
							capacity: capacity,
							eventDate: eventDate,
							edited: true,
						},
						{ merge: true }
					)
					.then(() => {
						setModalText('The event has been updated.');
						setModalVisible(true);
						setModalRedirect(true);
					})
					.catch((error) => {
						console.error(error);
						setModalText(error.message);
						setModalVisible(true);
					});
				break;
			}
			case 'service': {
				switch (true) {
					case listingTitle === '':
						setModalText('Please enter a title for your service listing');
						setModalVisible(true);
						return false;

					case description === '':
						setModalText('Please enter a description for your service listing');
						setModalVisible(true);
						return false;

					case location['lat'] == 0 || location['lng'] == 0:
						setModalText('Please enter a location for your service listing');
						setModalVisible(true);
						return false;

					case !category in ['community', 'other']:
						setModalText('Please enter a capacity for your service listing');
						setModalVisible(true);
						return false;

					case eventDate == null:
						setModalText('Please enter a date for your service listing');
						setModalVisible(true);
						return false;
				}

				db.collection('listings')
					.doc(listingId)
					.set(
						{
							listingTitle: listingTitle,
							description: description,
							location: location,
							eventDate: eventDate,
							category: category,
							edited: true,
						},
						{ merge: true }
					)
					.then(() => {
						setModalText('The service listing has been updated.');
						setModalVisible(true);
						setModalRedirect(true);
					})
					.catch((error) => {
						console.error(error);
						setModalText(error.message);
						setModalVisible(true);
					});
				break;
			}
		}
	}

	function setDate(date) {
		setShowDate(false);
		setExpiryDate(date);
		setEventDate(date);
	}

	useEffect(() => {
		setLoading(true);
		const subscriber = firebase
			.firestore()
			.collection('listings')
			.where(firebase.firestore.FieldPath.documentId(), '==', listingId)
			.onSnapshot((querySnapshot) => {
				querySnapshot.forEach((documentSnapshot) => {
					setListing(documentSnapshot.data());
					setType(documentSnapshot.data()['listingType']);
					setListingTitle(documentSnapshot.data()['listingTitle']);
					setListingTitleOriginal(documentSnapshot.data()['listingTitle']);
					setDescription(documentSnapshot.data()['description']);
					setLocation(documentSnapshot.data()['location']);
					setLocationOriginal({
						description: documentSnapshot.data()['location']['name'],
						geometry: {
							location: {
								lat: documentSnapshot.data()['location']['lat'],
								lng: documentSnapshot.data()['location']['lng'],
							},
						},
					});
					setCategory(documentSnapshot.data()['category']);
					setAllergen(documentSnapshot.data()['allergen']);
					setQuantity(documentSnapshot.data()['quantity']);
					setCollectionMethod(documentSnapshot.data()['collectionMethod']);
					setCondition(documentSnapshot.data()['condition']);
					setCapacity(documentSnapshot.data()['capacity']);
				});
				setLoading(false);
			});

		// Unsubscribe from events when no longer in use
		return () => subscriber();
	}, [listingId]);

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor={Colours.white} barStyle="dark-content" />
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalDelete}
				onRequestClose={() => {
					setModalDeleteVisible(false);
				}}
			>
				<View style={modalStyle.modalCenter}>
					<View style={[modalStyle.modalView, modalStyle.modalViewDelete]}>
						<View style={modalStyle.modalViewText}>
							<Text style={modalStyle.modalText}>
								Are you sure you want to delete this listing? You can't undo
								this action.
							</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity
								style={[modalStyle.modalButton, modalStyle.modalCancelButton]}
								onPress={() => {
									setModalDeleteVisible(false);
								}}
							>
								<Text style={modalStyle.modalButtonCancelText}>CANCEL</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[modalStyle.modalButton, modalStyle.modalDeleteButton]}
								onPress={() => {
									deleteListing();
									setModalDeleteVisible(false);
								}}
							>
								<Text style={modalStyle.modalButtonText}>DELETE</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(false);
				}}
			>
				<View style={modalStyle.modalCenter}>
					<View style={modalStyle.modalView}>
						<View style={modalStyle.modalViewText}>
							<Text style={modalStyle.modalText}>{modalText}</Text>
						</View>
						<TouchableOpacity
							style={[modalStyle.modalButton]}
							onPress={() => {
								setModalVisible(false);
								if (modalRedirect) {
									setModalRedirect(false);
									navigation.goBack();
								}
							}}
						>
							<Text style={modalStyle.modalButtonText}>OK</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
			<ScrollView>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Edit Listing</Text>
				</View>
				{loading && (
					<ActivityIndicator size="large" color={Colours.activityIndicator} />
				)}
				{!loading && (
					<View>
						<View style={styles.contentView}>
							<Text style={styles.inputTitle}>Listing Title</Text>
							<TextInput
								onChangeText={(val) => setListingTitle(val)}
								value={listingTitle}
								placeholder="Title"
								style={styles.inputText}
							/>
							<Text style={styles.inputTitle}>Listing Description</Text>
							<TextInput
								onChangeText={(val) => setDescription(val)}
								value={description}
								placeholder="Description"
								style={styles.inputText}
							/>
							<Text style={styles.inputTitle}>Location</Text>
							<GooglePlacesAutocomplete
								placeholder="Search..."
								onFail={(error) => console.error(error)}
								fetchDetails={true}
								value={location['name']}
								predefinedPlaces={[locationOriginal]}
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
							{type != 'essentialItem' && (
								<Text style={styles.inputTitle}>
									{type == 'food' ? 'Expiry Date' : 'Date'}
								</Text>
							)}
							{type !== 'essentialItem' && web && (
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
							{type !== 'essentialItem' && !web && (
								<TouchableOpacity
									style={styles.date}
									onPress={() => setShowDate(true)}
								>
									<Text style={styles.dateText}>{expiryDate}</Text>
								</TouchableOpacity>
							)}
							{type !== 'essentialItem' && !web && showDate && (
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
							{type === 'food' && (
								<View>
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
								</View>
							)}
							{type === 'essentialItem' && (
								<View>
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
								</View>
							)}
							{type === 'event' && (
								<View>
									<Text style={styles.inputTitle}>Event Capacity</Text>
									<TextInput
										value={capacity}
										onChangeText={(val) => setCapacity(val.replace(/\D/, ''))}
										placeholder="Number of people"
										keyboardType="numeric"
										style={styles.inputText}
									/>
								</View>
							)}
							{type === 'service' && (
								<View>
									<Text style={styles.inputTitle}>Category</Text>
									<DropDownPicker
										open={openCategoryType}
										items={categoryService}
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
								</View>
							)}
						</View>

						<TouchableOpacity
							style={[styles.submit]}
							onPress={() => {
								updateListing();
							}}
						>
							<Text style={styles.submitText}>SAVE</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.cancel, styles.cancelText]}
							onPress={() => {
								navigation.goBack();
							}}
						>
							<Text style={[styles.buttonText, styles.cancelText]}>CANCEL</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.submit]}
							onPress={() => {
								setModalDeleteVisible(true);
							}}
						>
							<Text style={styles.submitText}>DELETE</Text>
						</TouchableOpacity>
					</View>
				)}
			</ScrollView>
		</View>
	);
}

const styles = FormStyle();

const modalStyle = StyleSheet.create({
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
	modalViewDelete: {
		backgroundColor: Colours.koha_background,
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
		backgroundColor: Colours.koha_purple,
	},
	modalButtonText: {
		fontSize: Gui.screen.height * 0.25 * 0.1,
		color: Colours.white,
		fontFamily: 'Volte',
	},
	modalDeleteButton: {
		width: Gui.screen.width * 0.3,
		backgroundColor: Colours.koha_navy,
		marginLeft: 5,
	},
	modalCancelButton: {
		width: Gui.screen.width * 0.3,
		marginRight: 5,
	},
	modalButtonCancelText: {
		fontSize: Gui.screen.height * 0.25 * 0.1,
		color: Colours.white,
		fontFamily: 'Volte',
	},
});
export default EditListingScreen;

async function sendPushNotification(expoPushToken, title, body) {
	const message = {
		to: expoPushToken,
		sound: 'default',
		title: title,
		body: body,
	};

	await fetch('https://exp.host/--/api/v2/push/send', {
		mode: 'no-cors',
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Accept-encoding': 'gzip, deflate',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(message),
	});
}
