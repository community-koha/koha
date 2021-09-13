import { Dimensions } from 'react-native';

import colours from "./colours";

var {height, width} = Dimensions.get('window');
export default {
    screen:
    {
        height: height,
        width: width
    },
    container:
    {
        backgroundColor: colours.white,
        alignItems: 'center'
    },
    button:
    {
        height: height*0.05,
        width: width*0.75,
        fontSize: height*0.03,
        borderRadius: 3,
        borderWidth: 1,
		borderColor: Colours.black
    },
}