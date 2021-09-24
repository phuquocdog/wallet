/**
 * @fileOverview adapter for ReactNative TCP module
 * This module mimics the nodejs net api and is intended to work in RN environment.
 * @see https://github.com/Rapsssito/react-native-tcp-socket
 */


/**
 * Constructor function. Resulting object has to act as it was a real socket (basically
 * conform to nodejs/net api)
 *
 * @constructor
 */
function Socket() {
  
}

module.exports.Socket = Socket;
