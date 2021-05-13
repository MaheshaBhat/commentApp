import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Like} from '../../../Components/Icons';
import IconButton from '../../../Components/IconButton';
import {height, SPACING} from '../../../Constants';

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Like style={styles.iconStyle} />
        <Text>{'Max and 115 other >'}</Text>
      </View>
      <IconButton
        Icon={Like}
        onPress={() => true}
        title=""
        style={styles.right}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: SPACING * 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING,
    borderBottomColor: '#efefef',
    borderBottomWidth: 1,
    backgroundColor: '#FFF',
    zIndex: 11,
  },
  iconStyle: {
    height: SPACING * 2,
    width: SPACING * 2,
    marginRight: SPACING,
  },
  right: {
    flex: 0,
  },
  header: {
    flexDirection: 'row',
  },
});
