import { Dimensions } from 'react-native';

import Colours from "./colours";

var {height, width} = Dimensions.get('window');
export default {
    screen:
    {
        height: height,
        width: width
    },
    container:
    {
        backgroundColor: Colours.koha_white,
        alignItems: 'center'
    },
    button:
    {
        height: height*0.05,
        width: width*0.75,

        fontSize: height*0.025,

        borderRadius: height*0.012,
        borderColour: Colours.transparent,

        spacing: height*0.025,

        textColour: Colours.white
    },
}
