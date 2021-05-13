import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const SPACING = 10;

export const POST_HEIGHT = height * 0.5;
export const POST_WIDTH = width;

export {width, height, SPACING};
