import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  type WithTimingConfig,
  type WithSpringConfig,
} from 'react-native-reanimated';
import { type StyleProp, type ViewStyle } from 'react-native';

type Direction = 'up' | 'down' | 'left' | 'right';
type Preset = 'timing' | 'spring';

export interface SlideInViewProps {
  /** Direction the view slides in from (default 'up'). */
  from?: Direction;
  /** Translation offset in pixels (default 40). */
  distance?: number;
  /** Animation type: 'timing' or 'spring' (default 'spring'). */
  preset?: Preset;
  /** Duration in ms — only used when `preset` is 'timing' (default 400). */
  duration?: number;
  /** Spring config — only used when `preset` is 'spring'. */
  springConfig?: WithSpringConfig;
  /** Timing config — only used when `preset` is 'timing'. */
  timingConfig?: WithTimingConfig;
  /** Delay before animation starts in milliseconds (default 0). */
  delay?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Wraps children in an animated view that slides in from the given direction
 * when mounted.
 *
 * @example
 * <SlideInView from="left" distance={60} preset="spring">
 *   <Card />
 * </SlideInView>
 */
export const SlideInView: React.FC<SlideInViewProps> = ({
  from = 'up',
  distance = 40,
  preset = 'spring',
  duration = 400,
  springConfig,
  timingConfig,
  delay = 0,
  style,
  children,
}) => {
  const translateX = useSharedValue(from === 'left' ? -distance : from === 'right' ? distance : 0);
  const translateY = useSharedValue(from === 'up' ? distance : from === 'down' ? -distance : 0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const animate = (sv: Animated.SharedValue<number>, target: number) => {
      if (preset === 'spring') {
        sv.value = withDelay(delay, withSpring(target, springConfig));
      } else {
        const cfg: WithTimingConfig = { duration, ...timingConfig };
        sv.value = withDelay(delay, withTiming(target, cfg));
      }
    };

    animate(translateX, 0);
    animate(translateY, 0);
    animate(opacity, 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};
