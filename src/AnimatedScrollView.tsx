import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import React from 'react';
import { StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';

export interface ParallaxConfig {
  /** Height of the parallax header in pixels. */
  height: number;
  /** Render function for the header content. */
  renderHeader: () => React.ReactNode;
  /** Scroll speed multiplier for the parallax effect (default 0.5). */
  speed?: number;
  /** Optional style applied to the header container. */
  headerStyle?: StyleProp<ViewStyle>;
}

export interface AnimatedScrollViewProps
  extends React.ComponentProps<typeof Animated.ScrollView> {
  /** Optional parallax header configuration. */
  parallax?: ParallaxConfig;
  /** Content to render inside the scroll view. */
  children?: React.ReactNode;
}

/**
 * A scroll view that optionally adds a parallax header for a richer
 * browsing experience.  When no `parallax` prop is provided it behaves
 * identically to `Animated.ScrollView` from react-native-reanimated.
 */
export const AnimatedScrollView = React.forwardRef<
  Animated.ScrollView,
  AnimatedScrollViewProps
>(({ parallax, children, style, ...rest }, ref) => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll(event) {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    if (!parallax) return {};
    const speed = parallax.speed ?? 0.5;
    const translateY = interpolate(
      scrollY.value,
      [0, parallax.height],
      [0, -parallax.height * speed],
      Extrapolation.CLAMP,
    );
    return { transform: [{ translateY }] };
  });

  if (!parallax) {
    return (
      <Animated.ScrollView
        ref={ref}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={style}
        {...rest}
      >
        {children}
      </Animated.ScrollView>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.header,
          { height: parallax.height },
          parallax.headerStyle,
          headerAnimatedStyle,
        ]}
      >
        {parallax.renderHeader()}
      </Animated.View>

      <Animated.ScrollView
        ref={ref}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: parallax.height }}
        {...rest}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
});

AnimatedScrollView.displayName = 'AnimatedScrollView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 10,
  },
});
