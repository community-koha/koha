import { Dimensions } from 'react-native';

import Colours from './colours';

var { height, width } = Dimensions.get('window');
export default {
	screen: {
		height: height,
		width: width,
	},
	container: {
		backgroundColor: Colours.koha_background,
		alignItems: 'center',
	},
	button: {
		height: height * 0.07,
		width: width * 0.75,
		fontSize: height * 0.03,
		letterSpacing: 2,
		borderRadius: height * 0.012,
		borderColour: Colours.transparent,
		spacing: height * 0.03,
		textColour: Colours.white,
	},
	
};
