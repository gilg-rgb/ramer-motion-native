import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  type WithTimingConfig,
} from 'react-native-reanimated';
import { type StyleProp, type ViewStyle } from 'react-native';

export interface FadeInViewProps {
  /** Duration of the fade animation in milliseconds (default 400). */
  duration?: number;
  /** Delay before the animation starts in milliseconds (default 0). */
  delay?: number;
  /** Easing configuration forwarded to `withTiming`. */
  easing?: WithTimingConfig['easing'];
  /** Initial opacity (default 0). */
  from?: number;
  /** Final opacity (default 1). */
  to?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Wraps children in an animated view that fades in when mounted.
 *
 * @example
 * <FadeInView duration={600} delay={100}>
 *   <Text>Hello!</Text>
 * </FadeInView>
 */
export const FadeInView: React.FC<FadeInViewProps> = ({
  duration = 400,
  delay = 0,
  easing,
  from = 0,
  to = 1,
  style,
  children,
}) => {
  const opacity = useSharedValue(from);

  useEffect(() => {
    const config: WithTimingConfig = { duration, ...(easing ? { easing } : {}) };
    opacity.value = withDelay(delay, withTiming(to, config));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};
