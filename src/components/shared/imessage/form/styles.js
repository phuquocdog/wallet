import { StyleSheet } from 'react-native';
import { colors } from '../../../../constants/styleGuide';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  title: {
    textAlign: 'left',
    marginTop: 8,
    marginBottom: 3,
    // paddingLeft: 20,
    fontWeight: 'bold',
    color: colors.light.slateGray,
    paddingLeft: 20,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickers: {
    height: 120,
    width: 50,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pickerItem: {
    fontFamily: 'Gilroy',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  pickerPoint: {
    position: 'absolute',
    top: 29,
    fontFamily: 'Gilroy',
    fontSize: 43,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  pickerCurrency: {
    position: 'absolute',
    top: 50,
    fontFamily: 'Gilroy',
    fontSize: 16,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    paddingLeft: 240,
  },
  addressContainer: {
    width: '100%',
    marginTop: -15,
  },
  addressInput: {
    height: 48,
    paddingBottom: 11,
    paddingLeft: 46,
    fontSize: 13,
    backgroundColor: colors.light.white,
  },
  addressInputContainer: {
    minHeight: 48,
  },
  avatar: {
    position: 'absolute',
    zIndex: 1,
    left: 28,
    top: 28,
  },
  iconButton: {
    position: 'absolute',
    zIndex: 0,
    right: 21,
    top: 21,
    width: 46,
    height: 46,
    backgroundColor: colors.light.ultramarineBlue,
    borderRadius: 10,
    flexDirection: 'row',
    paddingLeft: 6,
    borderColor: colors.light.white,
    borderWidth: 8,
  },
  address: {
    fontWeight: 'bold',
    marginLeft: 10,
  },
  errorContainer: {
    height: 17,
  },
  pickerError: {
    textAlign: 'center',
    color: colors.light.slateGray,
  },
});
