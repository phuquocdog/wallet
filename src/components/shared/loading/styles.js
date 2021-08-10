import { Dimensions } from 'react-native';
import { colors } from '../../../constants/styleGuide';

const { width } = Dimensions.get('window');
const height = Math.floor((16 / 523) * width);

export default () => ({
  common: {
    wrapper: {
      width: '100%',
      overflow: 'hidden',
      backgroundColor: 'transparent',
    },
    iOSx: {
      zIndex: 10,
      height: 0,
      top: 34,
      left: 0,
      position: 'absolute',
    },
    iOS: {
      zIndex: 10,
      top: 0,
      height: 0,
      left: 0,
      position: 'absolute',
    },
    android: {
      backgroundColor: colors.light.ultramarineBlue,
      height: 4,
    },
    visible: {
      height: 4,
    },
    animation: {
      width,
      height,
      top: 0,
      left: 0,
      position: 'absolute',
    },
  },
});
