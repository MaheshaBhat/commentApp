import React, { useRef, useEffect, useCallback, useState } from "react";
import { StyleSheet, FlatList, View } from "react-native";

import Header from "./Header";
import Footer from "./Footer";
import Divider from "../../../Components/Divider";
import { SPACING, height } from "../../../Constants";
import Comment from "../../../Components/Comment";
import ActionSheet, {
  createScrollbarComponent,
} from "../../../Components/ActionSheet";

//const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedFlatList = createScrollbarComponent(FlatList);

export default function CommentBox({ show, comments, setCommentState }) {
  const renderItem = useCallback(({ item }, index) => {
    return <Comment comment={item} id={index} />;
  }, []);

  return (
    <ActionSheet
      renderHeader={() => <Header />}
      renderFooter={() => <Footer />}
      show={true}
      onClose={() => setCommentState(false)}
      //height={height / 2}
      //dragOffset={0.5}
    >
      <AnimatedFlatList
        data={comments}
        keyExtractor={(item, index) => item.slice(0, 10) + index}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000ad",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 15,
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  commentContainer: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
    borderTopRightRadius: SPACING / 2,
    borderTopLeftRadius: SPACING / 2,
    zIndex: 0,
  },
  messagesContainer: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    zIndex: 1,
    backgroundColor: "#fff",
  },
});
