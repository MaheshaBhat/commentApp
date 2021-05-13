import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SPACING} from '../../Constants';

export default function IconButton(props) {
  const {Icon, label, onPress, style} = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      id={label}
      style={[styles.btnStyle, style]}>
      <View style={styles.wrapper}>
        <Icon style={styles.iconStyle} />
        <Text style={styles.textStyle}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flex: 1,
    padding: SPACING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: 'grey',
    fontSize: 10,
  },
  iconStyle: {
    height: 20,
    width: 20,
    margin: SPACING,
  },
  btnStyle: {
    flex: 1,
  },
});
