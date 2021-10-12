import * as Font from 'expo-font';

export default useFonts = async () => {
	await Font.loadAsync({
		Volte: require('../assets/fonts/VolteRounded-Bold.ttf'),
	});
};
