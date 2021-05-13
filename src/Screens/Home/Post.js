import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {SPACING, POST_HEIGHT, POST_WIDTH} from '../../Constants';
import Divider from '../../Components/Divider';
import Footer from './Footer';
import Header from './Header';

export default function Post({post, id}) {
  return (
    <View style={styles.post}>
      <Header />
      <View style={styles.wrapper}>
        <Text
          id={`post${id}`}
          accessible
          accessibilityLabel={`post${id}`}
          style={styles.postText}>
          {post}
        </Text>
      </View>
      <Footer onComment={() => true} onLike={() => true} onShare={() => true} />
      <Divider backgroundColor="#fff" isHorizontal size={SPACING * 2} />
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    minHeight: POST_HEIGHT,
    width: POST_WIDTH,
    overflow: 'hidden',
  },
  wrapper: {
    flexGrow: 1,
    padding: SPACING,
  },
  postText: {
    fontSize: 20,
  },
});
