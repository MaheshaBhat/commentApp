import React, { useContext, useCallback } from "react";
import Animated from "react-native-reanimated";
import { ActionSheetContext } from "./ActionSheetContext";
import { DragType } from "./ActionSheet";

const sizeMap = {
  y: "height",
  x: "width",
};
export const createScrollbarComponent = (Component) => {
  const AnimScrollComp = Animated.createAnimatedComponent(Component);

  function AnimatedScrollbarComponent({
    onScroll,
    horizontal,
    onLayout,
    ...rest
  }) {
    const { scroll, axis } = useContext(ActionSheetContext);

    const customScroll = useCallback(({ nativeEvent }) => {
      if (nativeEvent.contentOffset.y === DragType.TOP_EDGE) {
        scroll.value = { ...scroll.value, [axis]: DragType.TOP_EDGE };
      } else if (
        Math.round(
          nativeEvent.layoutMeasurement[axis === "y" ? "height" : "width"] +
            nativeEvent.contentOffset[axis]
        ) === Math.round(nativeEvent.contentSize[sizeMap[axis]])
      ) {
        scroll.value = { ...scroll.value, [axis]: DragType.BOTTOM_EDGE };
      } else {
        scroll.value = { ...scroll.value, [axis]: DragType.CENTER };
      }
    }, []);
    return (
      <AnimScrollComp
        onLayout={(event) => {
          scroll.value = {
            ...scroll.value,
            [axis + "type"]:
              (!horizontal && axis === "x") || (!!horizontal && axis === "y")
                ? "no-scroll"
                : "scroll",
          };
          onLayout && onLayout(event);
        }}
        onScroll={(event) => {
          if ((!horizontal && axis === "y") || (!!horizontal && axis === "x")) {
            customScroll(event);
          }
          onScroll && onScroll(event);
        }}
        horizontal={!!horizontal}
        {...rest}
      />
    );
  }
  AnimatedScrollbarComponent.prototype.isScrollbarComponent = true;
  return AnimatedScrollbarComponent;
};
