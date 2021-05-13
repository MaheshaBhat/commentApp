import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from "react-native";
import {
  PanGestureHandler,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { ActionSheetProvider } from "./ActionSheetProvider";

const AnimatedTouchableWithoutFeedback = Animated.createAnimatedComponent(
  TouchableWithoutFeedback
);

const { width, height } = Dimensions.get("window");
const SPACING = 10;
//use it to get the context

//configs
export const DragType = {
  TOP_EDGE: 0,
  CENTER: 1,
  BOTTOM_EDGE: 2,
};

const translationType = {
  x: "translationX",
  y: "translationY",
};
const translationReverseType = {
  x: "translationY",
  y: "translationX",
};

const translateType = {
  x: "translateX",
  y: "translateY",
};

const velocityType = {
  x: "velocityX",
  y: "velocityY",
};

const absoluteType = {
  x: "absoluteX",
  y: "absoluteY",
};

const lockType = {
  NONE: 0,
  LOWER: 1,
  UPPER: -2,
};

const positionType = {
  BOTTOM: 0,
  TOP: 1,
  RIGHT: 2,
  LEFT: 3,
};
const position = {
  0: { top: "auto" },
  1: { bottom: "auto" },
  2: { left: "auto" },
  3: { right: "auto" },
};

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

export default function CommentBox({
  show,
  children = null,
  onClose,
  renderHeader = () => {},
  renderFooter = () => {},
  actionSheetSize = width * 0.7,
  dragOffset = 0.5,
  velocity = 0.04,
  visibleSize = SPACING * 6,
  borderRadius = SPACING,
  actionSheetPosition = positionType.LEFT,
  lock = lockType.NONE,
}) {
  const axis = actionSheetPosition <= 1 ? "y" : "x";
  const size = axis === "y" ? height : width;
  const modalSize = Math.min(actionSheetSize, size);
  const panRef = useRef();
  const listRef = useRef();
  const translate = useSharedValue(modalSize);
  const scroll = useSharedValue({ [axis]: DragType.TOP_EDGE });
  const opacity = useSharedValue(size - modalSize);

  const headerAxis = useRef(0);
  const footerAxis = useRef(modalSize);

  const styleY = useAnimatedStyle(() => ({
    transform: [{ translateY: translate.value }],
  }));

  const styleX = useAnimatedStyle(() => ({
    transform: [{ translateX: translate.value }],
  }));

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const getTranslateFrom = {
    [positionType.LEFT]: -modalSize + visibleSize,
    [positionType.RIGHT]: modalSize - visibleSize,
    [positionType.BOTTOM]: modalSize - visibleSize,
    [positionType.TOP]: -modalSize + visibleSize,
  };

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      const ax = event[axis];
      // allows to drag outside scroll view

      ctx.isOutsideScrollView =
        ax <= headerAxis.current || ax >= modalSize - footerAxis.current;

      //keep the state until drag released
      ctx.scroll = scroll.value[axis];

      ctx.initialPull =
        getTranslateFrom[actionSheetPosition] === translate.value;

      ctx.initialTranslateValue = translate.value;
    },
    onActive: (event, ctx) => {
      console.log(event);
      const trx = event[translationType[axis]];
      const trxReverse = event[translationReverseType[axis]];
      ctx.isNotScroll = Math.abs(trxReverse) > Math.abs(trx);
      if (ctx.isNotScroll) return;

      let isTopNotLocked = true;
      let isBottomNotLocked = true;
      const isLocked = lockType.NONE !== lock;
      if (isLocked) {
        isTopNotLocked = lock === lockType.LOWER;
        isBottomNotLocked = lock === lockType.UPPER;
      }
      const isModal =
        (ctx.scroll === DragType.TOP_EDGE && trx > 0 && isBottomNotLocked) ||
        (ctx.scroll === DragType.BOTTOM_EDGE && trx < 0 && isTopNotLocked) ||
        ctx.initialPull ||
        (ctx.isOutsideScrollView && trx > 0 && isBottomNotLocked) ||
        (ctx.isOutsideScrollView && trx < 0 && isTopNotLocked) ||
        (ctx.isOutsideScrollView && !isLocked);

      ctx.isModal = isModal;
      if (isModal) {
        if (!ctx.initialPull) {
          translate.value = ctx.initialTranslateValue + trx;
        } else {
          if (translate.value >= 0 && actionSheetPosition % 2 === 0) {
            translate.value = ctx.initialTranslateValue + trx;
          } else if (
            translate.value <= modalSize &&
            actionSheetPosition % 2 === 1
          ) {
            translate.value = ctx.initialTranslateValue + trx;
          }
        }
      }
    },
    onEnd: (event, ctx) => {
      if (
        ctx.isNotScroll ||
        (scroll.value[axis] === DragType.CENTER && !ctx.isModal)
      )
        return;
      const trx = event[translationType[axis]];
      const dt = (trx * modalSize) / (event[[velocityType[axis]]] * size);
      if (
        ctx.isModal &&
        !ctx.initialPull &&
        (Math.abs(trx) >= dragOffset * modalSize || Math.abs(dt) < velocity)
      ) {
        let translateTo;
        if (
          actionSheetPosition === positionType.BOTTOM ||
          actionSheetPosition === positionType.RIGHT
        ) {
          translateTo =
            Math.sign(trx) > 0 ? getTranslateFrom[actionSheetPosition] : size;
        } else {
          translateTo =
            Math.sign(trx) < 0
              ? Math.sign(trx) * getTranslateFrom[actionSheetPosition]
              : size;
        }

        animate(translate, translateTo * Math.sign(trx), (isFinished) => {
          if (isFinished) {
            if (visibleSize === 0) {
              runOnJS(onClose)();
              translate.value = translateTo;
            } else {
              if (translateTo === size) {
                opacity.value = 0;
                translate.value = getTranslateFrom[actionSheetPosition];
                animate(opacity, 1);
              }
            }
          }
        });
      } else {
        animate(translate, 0);
        animate(opacity, 1);
      }
    },
  });

  useEffect(() => {
    if (show) {
      translate.value = withSpring(getTranslateFrom[actionSheetPosition], {
        damping: 15,
        stiffness: 150,
      });
      animate(opacity, 1);
      scroll.value = { [axis]: DragType.TOP_EDGE };
    }
  }, [show]);

  if (!show) {
    return null;
  }

  const topLeft =
    actionSheetPosition === positionType.BOTTOM ||
    actionSheetPosition === positionType.LEFT;
  const topRight =
    actionSheetPosition === positionType.BOTTOM ||
    actionSheetPosition === positionType.LEFT;
  const bottomLeft =
    actionSheetPosition === positionType.TOP ||
    actionSheetPosition === positionType.RIGHT;
  const bottomRight =
    actionSheetPosition === positionType.TOP ||
    actionSheetPosition === positionType.LEFt;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: axis === "y" ? modalSize : "100%",
          width: axis === "y" ? "100%" : modalSize,
          ...position[actionSheetPosition],
        },
        axis === "y" ? styleY : styleX,
      ]}
    >
      <PanGestureHandler
        ref={panRef}
        simultaneousHandlers={listRef}
        onGestureEvent={eventHandler}
      >
        <Animated.View
          style={[
            styles.actionSheetContainer,
            {
              height: axis === "y" ? modalSize : "96%",
              width: axis === "y" ? "96%" : modalSize,
              borderTopRightRadius: topRight ? borderRadius : 0,
              borderTopLeftRadius: topLeft ? borderRadius : 0,
              borderBottomRightRadius: bottomRight ? borderRadius : 0,
              borderBottomLeftRadius: bottomLeft ? borderRadius : 0,
            },
            opacityStyle,
          ]}
        >
          <View
            onLayout={({ nativeEvent }) => {
              headerAxis.current =
                nativeEvent.layout[axis === "y" ? "height" : "width"];
            }}
          >
            {renderHeader()}
          </View>
          <NativeViewGestureHandler ref={listRef} simultaneousHandlers={panRef}>
            <AnimatedTouchableWithoutFeedback>
              <ActionSheetProvider scroll={scroll} axis={axis}>
                {children}
              </ActionSheetProvider>
            </AnimatedTouchableWithoutFeedback>
          </NativeViewGestureHandler>
          <View
            onLayout={({ nativeEvent }) =>
              (footerAxis.current =
                nativeEvent.layout[axis === "y" ? "height" : "width"])
            }
          >
            {renderFooter()}
          </View>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  actionSheetContainer: {
    //width: "100%",
    //height: "100%",
    //...StyleSheet.absoluteFillObject,
    zIndex: 100,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
});
