/* eslint-disable radix */
import {Animated, Easing, PanResponder} from 'react-native';

export const animate = (anim, value) => {
  return Animated.timing(anim, {
    toValue: value,
    duration: 500,
    delay: 50,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    useNativeDriver: true,
  });
};

export const createYPanResponder = (anim, onPanResponderMove, callback) => {
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    //onStartShouldSetPanResponderCapture: () => true,
    onPanResponderMove,
    onPanResponderRelease: (e, gesture) => {
      callback(gesture);
    },
  });
};

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}) => {
  console.log(layoutMeasurement.height + contentOffset.y);
  console.log(contentSize.height);
  return (
    parseInt(layoutMeasurement.height + contentOffset.y) ===
    parseInt(contentSize.height)
  );
};
