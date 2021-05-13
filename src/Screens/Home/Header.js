import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {POST_HEIGHT, SPACING} from '../../Constants';

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{'Title'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: POST_HEIGHT * 0.1,
    backgroundColor: '#efefef',
    justifyContent: 'center',
    padding: SPACING,
  },
  titleStyle: {
    fontSize: 25,
  },
});
