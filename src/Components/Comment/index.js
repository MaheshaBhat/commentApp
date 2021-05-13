import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SPACING} from '../../Constants';

export default function Comment({comment, id}) {
  return (
    <View style={styles.content}>
      <Text
        style={styles.commentText}
        id={`comment${id}`}
        accessible
        accessibilityLabel={`comment${id}`}>
        {comment}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING,
    margin: SPACING,
    alignSelf: 'baseline',
    borderColor: 'grey',
    borderWidth: 1,
    width: 'auto',
    borderRadius: SPACING * 2,
    backgroundColor: '#EFEFEF',
  },
  commentText: {
    color: '#000',
    fontSize: 15,
  },
});
