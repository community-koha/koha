import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, ScrollView } from 'react-native';
import AppLoading from 'expo-app-loading';
import { ListItem } from 'react-native-elements';
import Colours from '../config/colours.js';
import gui from '../config/gui.js';
import useFonts from '../config/useFonts';

const ListViewComponent = (props) => {
	const [listings, setListings] = useState(props.listing);
	const [watchedListings, setWatching] = useState(props.watched);
	const [noResults, setResults] = useState(props.results);
	const [isReady, setIsReady] = useState(false);
	const [navigation] = useState(props.nav);
	const LoadFonts = async () => {
		await useFonts();
	};

	useEffect(() => {
		setListings(props.listing);
		setWatching(props.watched);
		setResults(props.results);
	}, [props]);

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
		<ScrollView keyboardShouldPersistTaps="handled" style={styles.scroll}>
			{watchedListings.map((item, i) => {
				return (
					<ListItem
						style={styles.list}
						key={i}
						bottomDivider
						onPress={() =>
							navigation.navigate('ListingDetailScreen', {
								listingId: item.key,
							})
						}
					>
						<ListItem.Content>
							<ListItem.Title style={{ fontFamily: 'Volte' }}>
								Liked: {item.listingTitle}
							</ListItem.Title>
							<ListItem.Subtitle style={{ fontFamily: 'Volte' }}>
								{item.description}
							</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>
				);
			})}
			{noResults ? (
				<View>
					<Text style={styles.noListings}>No listings found.</Text>
				</View>
			) : (
				listings.map((item, i) => {
					return (
						<ListItem
							style={styles.list}
							key={i}
							bottomDivider
							onPress={() =>
								navigation.navigate('ListingDetailScreen', {
									listingId: item.key,
								})
							}
						>
							<ListItem.Content>
								<ListItem.Title>{item.listingTitle}</ListItem.Title>
								<ListItem.Subtitle>{item.description}</ListItem.Subtitle>
							</ListItem.Content>
						</ListItem>
					);
				})
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.white,
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: Platform.OS === 'ios' ? 20 : 0,
	},
	noListings: {
		fontSize: 22,
		padding: '10%',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		fontFamily: 'Volte',
	},
	filterContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 10,
	},
	scroll: {
		width: '100%',
		height: '73%',
	},
	list: {
		width: gui.screen.width,
		fontFamily: 'Volte',
	},
});

export default ListViewComponent;
