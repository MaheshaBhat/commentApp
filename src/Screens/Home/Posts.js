import React, {useCallback, useState} from 'react';
import {FlatList, SafeAreaView, TouchableOpacity} from 'react-native';

import Post from './Post';
import CommentsBox from './CommentsBox';

const DATA = require('../../../data.json');

export default function Posts() {
  const [posts, setPosts] = useState(DATA);
  const [toggleComments, setCommentState] = useState(false);
  const [comments, setComments] = useState([]);

  const renderItem = useCallback(({item}, index) => {
    return (
      <TouchableOpacity
        id="posts"
        onPress={() => {
          setComments(item.comments);
          setCommentState(true);
        }}>
        <Post post={item.post} id={index} />
      </TouchableOpacity>
    );
  }, []);

  return (
    <SafeAreaView>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <CommentsBox
        show={toggleComments}
        comments={comments}
        setCommentState={setCommentState}
      />
    </SafeAreaView>
  );
}
