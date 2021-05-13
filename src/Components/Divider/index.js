import React from 'react';
import {View} from 'react-native';

export default function Divider(props) {
  const {backgroundColor, isHorizontal, size} = props;
  const height = isHorizontal ? size : '100%';
  const width = isHorizontal ? '100%' : size;
  return <View style={{backgroundColor, height, width}} />;
}
