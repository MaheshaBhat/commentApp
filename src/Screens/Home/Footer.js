import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SPACING, POST_HEIGHT} from '../../Constants';
import {Like, Comment, Share} from '../../Components/Icons';
import IconButton from '../../Components//IconButton';

export default function Footer({onComment, onLike, onShare}) {
  return (
    <View style={styles.container}>
      <IconButton Icon={Like} label="Like" onPress={onLike} />
      <IconButton Icon={Comment} label="Comment" onPress={onComment} />
      <IconButton Icon={Share} label="Share" onPress={onShare} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: POST_HEIGHT * 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#efefef',
  },
});
