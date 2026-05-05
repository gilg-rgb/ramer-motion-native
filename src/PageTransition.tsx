import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  type WithTimingConfig,
} from 'react-native-reanimated';
import { type StyleProp, type ViewStyle } from 'react-native';

type TransitionType = 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale';

export interface PageTransitionProps {
  /**
   * Controls whether the page is visible.  Toggle this value to trigger the
   * enter / exit animation.
   */
  visible: boolean;
  /** Animation preset (default 'fade'). */
  type?: TransitionType;
  /** Duration of the animation in milliseconds (default 350). */
  duration?: number;
  /** Delay before the animation starts in milliseconds (default 0). */
  delay?: number;
  /** Custom timing config forwarded to `withTiming`. */
  timingConfig?: WithTimingConfig;
  /** Translation distance in pixels used by slide presets (default 40). */
  distance?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

function getInitialTranslate(type: TransitionType, distance: number) {
  switch (type) {
    case 'slideUp':    return { x: 0, y: distance };
    case 'slideDown':  return { x: 0, y: -distance };
    case 'slideLeft':  return { x: distance, y: 0 };
    case 'slideRight': return { x: -distance, y: 0 };
    default:           return { x: 0, y: 0 };
  }
}

/**
 * A wrapper component that animates its children in or out based on the
 * `visible` prop.  Use it around screen content to produce smooth
 * page-level transitions.
 *
 * @example
 * <PageTransition visible={isDetailVisible} type="slideLeft">
 *   <DetailScreen />
 * </PageTransition>
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  visible,
  type = 'fade',
  duration = 350,
  delay = 0,
  timingConfig,
  distance = 40,
  style,
  children,
}) => {
  const { x: initX, y: initY } = getInitialTranslate(type, distance);
  const opacity = useSharedValue(visible ? 1 : 0);
  const translateX = useSharedValue(visible ? 0 : initX);
  const translateY = useSharedValue(visible ? 0 : initY);
  const scale = useSharedValue(visible ? 1 : type === 'scale' ? 0.85 : 1);

  useEffect(() => {
    const cfg: WithTimingConfig = { duration, ...timingConfig };
    const animate = (sv: Animated.SharedValue<number>, target: number) => {
      sv.value = withDelay(delay, withTiming(target, cfg)) as number;
    };

    if (visible) {
      animate(opacity, 1);
      animate(translateX, 0);
      animate(translateY, 0);
      animate(scale, 1);
    } else {
      animate(opacity, 0);
      animate(translateX, initX);
      animate(translateY, initY);
      if (type === 'scale') animate(scale, 0.85);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};
