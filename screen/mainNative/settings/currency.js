import React, { useState, useEffect, useContext } from 'react';
import { FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

import navigationStyle from '../../components/navigationStyle';
import { SafeBlueArea, BlueListItem, BlueText, BlueCard } from '../../BlueComponents';
import loc from '../../loc';
import { BlueStorageContext } from '../../blue_modules/storage-context';

const data = Object.values('');

const Currency = () => {
  const { setPreferredFiatCurrency } = useContext(BlueStorageContext);
  const [isSavingNewPreferredCurrency, setIsSavingNewPreferredCurrency] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: colors.background,
    },
    activity: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
  });

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const preferredCurrency = 'USD'
        if (preferredCurrency === null) {
          throw Error();
        }
        setSelectedCurrency(preferredCurrency);
      } catch (_error) {
        setSelectedCurrency(FiatUnit.USD);
      }
    };
    fetchCurrency();
  }, []);

  if (selectedCurrency !== null && selectedCurrency !== undefined) {
    return (
      <SafeBlueArea>
        <FlatList
          style={styles.flex}
          keyExtractor={(_item, index) => `${index}`}
          data={data}
          initialNumToRender={25}
          extraData={data}
          renderItem={({ item }) => {
            return (
              <BlueListItem
                disabled={isSavingNewPreferredCurrency}
                title={`${item.endPointKey} (${item.symbol})`}
                checkmark={selectedCurrency.endPointKey === item.endPointKey}
                onPress={async () => {
                  
                  setPreferredFiatCurrency();
                }}
              />
            );
          }}
        />
        <BlueCard>
          <BlueText>
            {loc.settings.currency_source} {selectedCurrency.source}
          </BlueText>
        </BlueCard>
      </SafeBlueArea>
    );
  }
  return (
    <View style={styles.activity}>
      <ActivityIndicator />
    </View>
  );
};

Currency.navigationOptions = navigationStyle({}, opts => ({ ...opts, title: loc.settings.currency }));

export default Currency;
