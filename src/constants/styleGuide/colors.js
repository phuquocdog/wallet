const common = {
  black: '#000',
  white: '#fff',
  BTC: '#EC8D08',
  ultramarineBlue: '#4070F4',
  maastrichtBlue: '#0C142D',
  slateGray: '#71778B',
  blueGray: '#8A8CA2',
  ghost: '#BEC1CD',
  platinum: '#E1E3EA',
  mystic: '#EDF0F5',
  whiteSmoke: '#F5F7FA',
  burntSieanna: '#EC6868',
  ufoGreen: '#2AD67C',
};

const light = {
  ...common,
  outgoingArrow: common.maastrichtBlue,
  headerBg: common.whiteSmoke,
  tabBarText: common.black,
};

const dark = {
  ...common,
  outgoingArrow: common.platinum,
  headerBg: '#1C1C1E',
  homeHeaderBg: '#1C316A',
  mainBg: common.black,
  footerBg: '#1C1C1C',
  textInputBg: '#1C1C1E',
  tabBarText: common.white,
};

export default {
  light,
  dark,
};
