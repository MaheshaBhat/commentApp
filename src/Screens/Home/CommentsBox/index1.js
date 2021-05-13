import React, { useRef, useEffect, useCallback, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import {
  PanGestureHandler,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  interpolate,
  Easing,
  runOnJS,
  useDerivedValue,
  Extrapolate,
} from "react-native-reanimated";
import Header from "./Header";
import Footer from "./Footer";
import Divider from "../../../Components/Divider";
import { SPACING, height as modalHeight } from "../../../Constants";
import Comment from "../../../Components/Comment";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

//configs
const DragType = {
  TOP_EDGE: 0,
  CENTER: 1,
  BOTTOM_EDGE: 2,
};
const velocity = 0.05;
const height = modalHeight;
const dragOffset = 0.5;

export default function CommentBox({ show, comments, setCommentState }) {
  const scrollRef = useRef();
  const panRef = useRef();
  const listRef = useRef();
  const maxVal = useRef(height);
  const [scrollY, setScrollY] = useState(0);
  const translateY = useSharedValue(height);
  const opacity = useSharedValue(height);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animate = (anim, value, callback) => {
    "worklet";
    anim.value = withTiming(
      value,
      {
        duration: 500,
        delay: 50,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
      callback
    );
  };

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      // allows to drag outside scroll view
      ctx.isOutsideScrollView =
        event.y <= SPACING * 6 || event.y >= height - SPACING * 6;

      //keep the state until drag released
      ctx.scrollY = scrollY;
    },
    onActive: (event, ctx) => {
      const isModal =
        (ctx.scrollY === DragType.TOP_EDGE && event.translationY > 0) ||
        (ctx.scrollY === DragType.BOTTOM_EDGE && event.translationY < 0);
      ctx.isModal = isModal;
      if (isModal || ctx.isOutsideScrollView)
        translateY.value = event.translationY;
    },
    onEnd: (event, ctx) => {
      if (ctx.scrollY === DragType.CENTER && !ctx.isOutsideScrollView) return;

      const dt = event.translationY / event.velocityY;
      if (
        Math.abs(event.translationY) >= dragOffset * height ||
        (ctx.isModal && Math.abs(dt) < velocity)
      ) {
        animate(
          translateY,
          height * Math.sign(event.translationY),
          (isFinished) => {
            if (isFinished) {
              runOnJS(setCommentState)(false);
              runOnJS(setScrollY)(0);
              translateY.value = height;
            }
          }
        );
        animate(opacity, 0);
      } else {
        animate(translateY, 0);
        animate(opacity, 1);
      }
    },
  });

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (show) {
      animate(translateY, 0);
      animate(opacity, 1);
    }
  }, [show]);

  const renderItem = useCallback(({ item }, index) => {
    return <Comment comment={item} id={index} />;
  }, []);

  if (!show) {
    return null;
  }
  const onScroll = ({ nativeEvent }) => {
    maxVal.current = Math.round(
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y
    );
    if (nativeEvent.contentOffset.y === 0) {
      setScrollY(0);
    } else if (maxVal.current === Math.round(nativeEvent.contentSize.height)) {
      setScrollY(2);
    } else {
      setScrollY(1);
    }
  };

  return (
    <Animated.View
      style={[styles.container, opacityStyle]}
      id={"comments"}
      accessible
      accessibilityLabel={"comments"}
    >
      <PanGestureHandler
        ref={panRef}
        simultaneousHandlers={listRef}
        onGestureEvent={eventHandler}
      >
        <Animated.View style={[styles.commentContainer, style]}>
          <Header />

          <NativeViewGestureHandler ref={listRef} simultaneousHandlers={panRef}>
            <AnimatedFlatList
              ref={scrollRef}
              data={comments}
              keyExtractor={(item, index) => item.slice(0, 10) + index}
              renderItem={renderItem}
              contentContainerStyle={styles.contentContainerStyle}
              onScroll={onScroll}
            />
          </NativeViewGestureHandler>
          <Footer />
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000ad",
    justifyContent: "flex-end",
    alignItems: "center",
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
    zIndex: 100,
    backgroundColor: "#fff",
  },
});
