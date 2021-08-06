import React, { Component } from 'react'
//import { connect } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text, View, TouchableOpacity, Dimensions, StatusBar, Animated, StyleSheet } from 'react-native'
//import { getUserName, getWebsocketToken } from 'src/utils/requests'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const rem = SCREEN_WIDTH / 414
const FONT = 'Helvetica Neue'

const OPACITY_FADE_IN_DURATION = 500
const OPACITY_FADE_OUT_DURATION = 1000
const SCALE_FADE_IN_DURATION = 2000
const INITIAL_SCALE = 0.75

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#000',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleView: {
    // backgroundColor: '#00f',
  },
  titleText: {
    // position: 'absolute',
    // top: SCREEN_HEIGHT * 0.4,
    // left: SCREEN_WIDTH * 0.21,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'TeutonHell',
    fontSize: 30 * rem,
    letterSpacing: 12 * rem,
    padding: 0
  },
  startSign: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'TeutonHell',
    fontSize: 25 * rem,
    position: 'absolute',
    top: 0,
    right: -10 * rem
  },
  date: {
    marginBottom: 20 * rem
  },
  subtitle: {
    color: '#555',
    fontSize: 18 * rem,
    marginTop: 10 * rem,
    marginBottom: 5 * rem
  },
  button: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.12,
    backgroundColor: '#000',
    width: SCREEN_WIDTH * 0.42,
    height: SCREEN_WIDTH * 0.1,
    borderColor: '#fff',
    borderWidth: 1
  },
  touch: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  joinNow: {
    left: SCREEN_WIDTH * 0.05
  },
  login: {
    backgroundColor: '#fff',
    right: SCREEN_WIDTH * 0.05
  },
  buttonText: {
    fontSize: 12,
    fontFamily: FONT,
    color: '#fff'
  },
  loginText: {
    color: '#000'
  }
})

class Landing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checking: true,
      opacity: new Animated.Value(0),
      scale: new Animated.Value(INITIAL_SCALE)
    }
  }

  static navigationOptions = {
    title: 'FRM'
  }

  componentDidMount() {
    this._getToken()
    Animated.timing(this.state.opacity, {
      toValue: 1.0,
      duration: OPACITY_FADE_IN_DURATION,
      useNativeDriver: true
    }).start()
    Animated.timing(this.state.scale, {
      toValue: 0.9,
      duration: SCALE_FADE_IN_DURATION,
      useNativeDriver: true
    }).start()
  }

  render() {
    return (
      <View style={styles.mainView}>
        <StatusBar barStyle="light-content" />
        <Animated.View
          style={[
            styles.titleView,
            {
              transform: [{ scaleX: this.state.scale }, { scaleY: this.state.scale }]
            }
          ]}>
          <Animated.Text style={{ ...styles.titleText, opacity: this.state.opacity }}>{'PhuQuoc Doge'}</Animated.Text>
          <Animated.Text style={{ ...styles.startSign, opacity: this.state.opacity }}>*</Animated.Text>
        </Animated.View>

        {!this.state.checking && (
          <Animated.View style={[styles.button, styles.joinNow, { opacity: this.state.opacity }]}>
            <TouchableOpacity
              style={styles.touch}
              onPress={() => this._handleNavigate('Join')}
              accessibilityLabel="log in">
              <Text style={styles.buttonText}>JOIN NOW</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        {!this.state.checking && (
          <Animated.View style={[styles.button, styles.login, { opacity: this.state.opacity }]}>
            <TouchableOpacity
              style={styles.touch}
              onPress={() => this._handleNavigate('Login')}
              accessibilityLabel="log in">
              <Text style={[styles.buttonText, styles.loginText]}>LOG IN</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    )
  }

  _handleNavigate(destination) {
    const { navigate } = this.props.navigation
    navigate(destination)
  }

  _getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@token')
      if (value !== null) {
        // Get username
        const username = await getUserName({ token: value })
        const wsToken = await getWebsocketToken({ token: value })

        this.props.dispatch(fetchUserProfileSucceeded(username))
        this.props.dispatch(updateWebSocketToken(wsToken))

        setTimeout(() => {
          Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: OPACITY_FADE_OUT_DURATION,
            useNativeDriver: true
          }).start()
        }, SCALE_FADE_IN_DURATION * 0.5)
        setTimeout(() => {
          // this.props.navigation.navigate('Main')
          this.props.dispatch(setToken(value))
        }, OPACITY_FADE_OUT_DURATION + SCALE_FADE_IN_DURATION * 0.5)
      } else {
        this.setState({
          checking: false
        })
      }
    } catch (e) {
      // error reading value
      console.error(e)
    }
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth }
}

export default Landing;

