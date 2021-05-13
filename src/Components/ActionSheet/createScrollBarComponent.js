import React, { useContext, useCallback } from "react";
import Animated from "react-native-reanimated";
import {  ActionSheetContext } from "./ActionSheetContext";
import { DragType } from "./ActionSheet";

export const createScrollbarComponent = (Component) => {
  const AnimScrollComp = Animated.createAnimatedComponent(Component);

  return function AnimatedScrollbarComponent({ onScroll, ...rest }) {
    const { scroll, axis } = useContext(ActionSheetContext);

    const customScroll = useCallback(({ nativeEvent }) => {
      if (nativeEvent.contentOffset.y === DragType.TOP_EDGE) {
        scroll.value = { [axis]: DragType.TOP_EDGE };
      } else if (
        Math.round(
          nativeEvent.layoutMeasurement[axis === "y" ? "height" : "width"] +
            nativeEvent.contentOffset[axis]
        ) ===
        Math.round(nativeEvent.contentSize[axis === "y" ? "height" : "width"])
      ) {
        scroll.value = { [axis]: DragType.BOTTOM_EDGE };
      } else {
        scroll.value = { [axis]: DragType.CENTER };
      }
    }, []);
    return (
      <AnimScrollComp
        onScroll={(event) => {
          customScroll(event);
          onScroll && onScroll(event);
        }}
        {...rest}
      />
    );
  };
};
