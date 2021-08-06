// Copyright 2017-2021 @polkadot/example-react authors & contributors
// SPDX-License-Identifier: Apache-2.0
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import type {Node} from 'react';
import { Button, SafeAreaView, ScrollView, StatusBar, 
  StyleSheet, Text, View,
  useColorScheme

} from 'react-native';

import 'raf/polyfill';

import Identicon from '@polkadot/reactnative-identicon';
import { keyring } from '@polkadot/ui-keyring';
import { settings } from '@polkadot/ui-settings';
import { cryptoWaitReady, mnemonicGenerate } from '@polkadot/util-crypto';

import { ApiPromise, WsProvider} from '@polkadot/api';


import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


import AppContainer from './src/screens';


const Alice = '5DSDrF67gqHfnZpGNv4sHSsz16po2xnEbCp8D7Ez33oUaxsC';

async function main () {
  // Initialise the provider to connect to the local node
  const provider = new WsProvider('wss://node.phuquoc.dog');

  // Create the API and wait until ready
  const api = await ApiPromise.create({ provider });
  let {
    data: {
      free: previousFree 
    },
    nonce: previousNonce 
  } = await api.query.system.account(Alice);

  console.log(`${Alice} has a balance of ${previousFree}, nonce ${previousNonce}`);
  console.log(`You may leave this example running and start example 06 or transfer any value to ${Alice}`);

  // Retrieve the chain & node information information via rpc calls
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);

  let count = 0;
  // const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
  //   console.log(`Chain is at block: #${header.number}`);

  //   if (++count === 256) {
  //     unsubscribe();
  //     process.exit(0);
  //   }
  // });

  console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
}

main().catch(console.error).finally(() => process.exit());

const styles = StyleSheet.create({
  body: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    backgroundColor: Colors.white
  },
  buttonContainer: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column'
  },
  mainTitle: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    color: Colors.black,
    fontSize: 28,
    fontWeight: '600'
  },
  scrollView: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    backgroundColor: Colors.lighter
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24
  },
  sectionDescription: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    color: Colors.dark,
    fontSize: 18,
    fontWeight: '400',
    marginTop: 8
  },
  sectionTitle: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    color: Colors.black,
    fontSize: 24,
    fontWeight: '600'
  }
});

const globalAny = global;

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [isReady, setReady] = useState(false);
  const [address, setAddress] = useState('');
  const [phrase, setPhrase] = useState('');
  const [ss58Format, setSS58Format] = useState(42);

  const _onClickNew = (): void => {
    const phrase = mnemonicGenerate(12);
    const { address } = keyring.createFromUri(phrase);

    setAddress(keyring.encodeAddress(address, ss58Format));
    setPhrase(phrase);
  };

  const _onChangeSS58Format = (value: string): void => {
    console.log(value);
    setSS58Format(parseInt(value, 10));
  };

  useEffect((): void => {
    isReady && _onClickNew();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect((): void => {
    isReady && address && setAddress(keyring.encodeAddress(address, ss58Format));
  }, [address, isReady, ss58Format]);

  const initialize = async (): Promise<void> => {
    try {
      keyring.loadAll({ ss58Format: 42, type: 'sr25519' });
    } catch (e) {
      console.log('Error loading keyring ', e);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await globalAny.localStorage.init();
    await cryptoWaitReady().then((a) =>{
        console.log(a);

    });
    console.log(settings);

    setReady(true);
    _onClickNew();
  };

  if (!isReady) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initialize();
  }

  if (!isReady || !address || !phrase) {
    return null;
  }

  return (
    <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior='automatic'
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.mainTitle}>Phu Quoc Dog Wallet</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Button
                onPress={_onClickNew}
                title='Generate Address'
              />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Phrase</Text>
              <Text
                selectable={true}
                style={styles.sectionDescription}
              >
                {phrase}
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Icons</Text>
              <Identicon value={address} />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Address</Text>
              <Text style={styles.sectionDescription}>{address}</Text>
            </View>
            
            
          </View>
        </ScrollView>
      </SafeAreaView>
  );
};

const App = () => {

  return (
    <AppContainer />
  );
}

export default App;