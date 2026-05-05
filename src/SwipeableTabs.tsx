import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedScrollHandler,
  scrollTo,
  useAnimatedRef,
  runOnUI,
  type WithTimingConfig,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface Tab {
  /** Unique key for the tab. */
  key: string;
  /** Label displayed in the tab bar. */
  label: string;
  /** Content rendered when this tab is active. */
  content: React.ReactNode;
}

export interface SwipeableTabsProps {
  /** Array of tab definitions. */
  tabs: Tab[];
  /** Initial active tab index (default 0). */
  initialIndex?: number;
  /** Width of each page — defaults to full screen width. */
  pageWidth?: number;
  /** Animation config for the indicator (default duration 250ms). */
  indicatorAnimationConfig?: WithTimingConfig;
  /** Style applied to the outer container. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Style applied to the tab bar. */
  tabBarStyle?: StyleProp<ViewStyle>;
  /** Style applied to each tab button. */
  tabStyle?: StyleProp<ViewStyle>;
  /** Style applied to each tab label. */
  labelStyle?: StyleProp<TextStyle>;
  /** Style applied to the animated indicator. */
  indicatorStyle?: StyleProp<ViewStyle>;
  /** Background color of the tab bar (default '#fff'). */
  tabBarColor?: string;
  /** Color of the active indicator (default '#6200ee'). */
  indicatorColor?: string;
}

/**
 * A horizontally swipeable tab view with a sliding indicator.
 * Supports both programmatic tab selection and free swipe gestures.
 *
 * @example
 * <SwipeableTabs
 *   tabs={[
 *     { key: 'a', label: 'Home',    content: <HomeScreen /> },
 *     { key: 'b', label: 'Search',  content: <SearchScreen /> },
 *     { key: 'c', label: 'Profile', content: <ProfileScreen /> },
 *   ]}
 * />
 */
export const SwipeableTabs: React.FC<SwipeableTabsProps> = ({
  tabs,
  initialIndex = 0,
  pageWidth = SCREEN_WIDTH,
  indicatorAnimationConfig = { duration: 250 },
  containerStyle,
  tabBarStyle,
  tabStyle,
  labelStyle,
  indicatorStyle,
  tabBarColor = '#fff',
  indicatorColor = '#6200ee',
}) => {
  const activeIndex = useSharedValue(initialIndex);
  const tabCount = tabs.length;
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const tabWidths = useRef<number[]>(new Array(tabCount).fill(0));
  const tabOffsets = useRef<number[]>(new Array(tabCount).fill(0));
  const indicatorLeft = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const updateIndicator = useCallback(
    (index: number) => {
      indicatorLeft.value = withTiming(tabOffsets.current[index] ?? 0, indicatorAnimationConfig);
      indicatorWidth.value = withTiming(tabWidths.current[index] ?? 0, indicatorAnimationConfig);
    },
    [indicatorLeft, indicatorWidth, indicatorAnimationConfig],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll(event) {
      const x = event.contentOffset.x;
      const rawIndex = x / pageWidth;
      const snapped = Math.round(rawIndex);
      if (snapped !== activeIndex.value && snapped >= 0 && snapped < tabCount) {
        activeIndex.value = snapped;
      }
    },
  });

  const selectTab = useCallback(
    (index: number) => {
      activeIndex.value = index;
      runOnUI(() => {
        'worklet';
        scrollTo(scrollRef, index * pageWidth, 0, true);
      })();
      updateIndicator(index);
    },
    [activeIndex, scrollRef, pageWidth, updateIndicator],
  );

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    left: indicatorLeft.value,
    width: indicatorWidth.value,
  }));

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Tab bar */}
      <View style={[styles.tabBar, { backgroundColor: tabBarColor }, tabBarStyle]}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, tabStyle]}
            onPress={() => selectTab(index)}
            onLayout={(e) => {
              const { width, x } = e.nativeEvent.layout;
              tabWidths.current[index] = width;
              tabOffsets.current[index] = x;
              // Initialize indicator for the first tab
              if (index === initialIndex) {
                indicatorLeft.value = x;
                indicatorWidth.value = width;
              }
            }}
          >
            <Text style={[styles.label, labelStyle]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
        {/* Sliding indicator */}
        <Animated.View
          style={[
            styles.indicator,
            { backgroundColor: indicatorColor },
            indicatorStyle,
            indicatorAnimatedStyle,
          ]}
        />
      </View>

      {/* Pages */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentOffset={{ x: initialIndex * pageWidth, y: 0 }}
      >
        {tabs.map((tab) => (
          <View key={tab.key} style={[styles.page, { width: pageWidth }]}>
            {tab.content}
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    borderRadius: 1.5,
  },
  page: {
    flex: 1,
  },
});
