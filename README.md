# ramer-motion-native

> A React Native animation library for a **better browsing experience** — smooth scroll, parallax headers, entrance animations, swipeable tabs, and page transitions.

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/react--native-%3E%3D0.72-61dafb)](https://reactnative.dev)
[![Reanimated](https://img.shields.io/badge/reanimated-%3E%3D3.0-purple)](https://docs.swmansion.com/react-native-reanimated/)

---

## Table of Contents

- [Why ramer-motion-native?](#why-ramer-motion-native)
- [Installation](#installation)
- [Components](#components)
  - [AnimatedScrollView](#animatedscrollview)
  - [FadeInView](#fadeinview)
  - [SlideInView](#slideinview)
  - [SwipeableTabs](#swipeabletabs)
  - [PageTransition](#pagetransition)
- [Props Reference](#props-reference)
- [Requirements](#requirements)
- [Contributing](#contributing)
- [License](#license)

---

## Why ramer-motion-native?

Modern mobile users expect fluid, responsive interfaces. Abrupt content appearances, static scroll views, and jerky tab switches break the immersive feel that great apps provide. **ramer-motion-native** fills that gap with a small, composable set of components that are:

- **Zero-config** — sensible defaults out of the box.
- **Highly customizable** — every timing, spring, and style detail is exposed.
- **Performant** — all animations run on the UI thread via `react-native-reanimated`.
- **Gesture-driven** — swipe gestures are first-class citizens.

---

## Installation

```bash
# npm
npm install ramer-motion-native react-native-reanimated react-native-gesture-handler

# yarn
yarn add ramer-motion-native react-native-reanimated react-native-gesture-handler
```

Follow the [Reanimated installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started) and the [Gesture Handler setup guide](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation) to complete native configuration.

---

## Components

### AnimatedScrollView

A drop-in replacement for `ScrollView` that adds an optional **parallax header** — the header image or content scrolls at a slower rate than the page, creating depth.

```tsx
import { AnimatedScrollView } from 'ramer-motion-native';
import { Image, Text, View } from 'react-native';

export default function ArticleScreen() {
  return (
    <AnimatedScrollView
      parallax={{
        height: 260,
        speed: 0.4,
        renderHeader: () => (
          <Image
            source={{ uri: 'https://example.com/hero.jpg' }}
            style={{ width: '100%', height: 260 }}
            resizeMode="cover"
          />
        ),
      }}
    >
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Article Title</Text>
        <Text style={{ marginTop: 8, lineHeight: 24 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit…
        </Text>
      </View>
    </AnimatedScrollView>
  );
}
```

Without the `parallax` prop it behaves identically to `Animated.ScrollView` from Reanimated and can accept a `ref`.

---

### FadeInView

Fades its children in when mounted.

```tsx
import { FadeInView } from 'ramer-motion-native';
import { Text } from 'react-native';

<FadeInView duration={600} delay={150}>
  <Text>I appear with a smooth fade.</Text>
</FadeInView>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `400` | Animation duration (ms). |
| `delay` | `number` | `0` | Delay before the animation starts (ms). |
| `from` | `number` | `0` | Initial opacity. |
| `to` | `number` | `1` | Target opacity. |
| `easing` | `EasingFunction` | — | Custom easing forwarded to `withTiming`. |

---

### SlideInView

Slides its children in from a given direction when mounted.

```tsx
import { SlideInView } from 'ramer-motion-native';
import { Image } from 'react-native';

// Spring slide from the left
<SlideInView from="left" distance={60} preset="spring">
  <Image source={require('./avatar.png')} />
</SlideInView>

// Timed slide from below with a delay
<SlideInView from="up" duration={400} preset="timing" delay={200}>
  <Text>Slides up into view.</Text>
</SlideInView>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `from` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Enter direction. |
| `distance` | `number` | `40` | Translation offset in pixels. |
| `preset` | `'spring' \| 'timing'` | `'spring'` | Animation type. |
| `duration` | `number` | `400` | Duration (ms) — only used with `'timing'`. |
| `springConfig` | `WithSpringConfig` | — | Spring config — only used with `'spring'`. |
| `delay` | `number` | `0` | Delay before animation starts (ms). |

---

### SwipeableTabs

A horizontally swipeable tab view with an animated sliding indicator. Supports both programmatic selection and free swipe gestures.

```tsx
import { SwipeableTabs } from 'ramer-motion-native';
import { View, Text } from 'react-native';

const tabs = [
  { key: 'home',    label: 'Home',    content: <HomeScreen /> },
  { key: 'search',  label: 'Search',  content: <SearchScreen /> },
  { key: 'profile', label: 'Profile', content: <ProfileScreen /> },
];

export default function App() {
  return (
    <SwipeableTabs
      tabs={tabs}
      initialIndex={0}
      indicatorColor="#6200ee"
      tabBarColor="#fafafa"
    />
  );
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `Tab[]` | required | Array of `{ key, label, content }` objects. |
| `initialIndex` | `number` | `0` | Index of the initially active tab. |
| `pageWidth` | `number` | screen width | Width of each page. |
| `indicatorColor` | `string` | `'#6200ee'` | Color of the sliding indicator. |
| `tabBarColor` | `string` | `'#fff'` | Background color of the tab bar. |
| `indicatorAnimationConfig` | `WithTimingConfig` | `{ duration: 250 }` | Timing config for the indicator slide. |

---

### PageTransition

Animates its children in or out based on the `visible` prop. Useful for screen-level transitions without a full navigation library.

```tsx
import { PageTransition } from 'ramer-motion-native';
import { useState } from 'react';
import { Button } from 'react-native';
import { DetailScreen } from './DetailScreen';

export default function App() {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <Button title="Open detail" onPress={() => setShowDetail(true)} />
      <PageTransition visible={showDetail} type="slideLeft" duration={400}>
        <DetailScreen onClose={() => setShowDetail(false)} />
      </PageTransition>
    </>
  );
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | required | Toggle to trigger enter / exit. |
| `type` | `'fade' \| 'slideUp' \| 'slideDown' \| 'slideLeft' \| 'slideRight' \| 'scale'` | `'fade'` | Transition preset. |
| `duration` | `number` | `350` | Animation duration (ms). |
| `delay` | `number` | `0` | Delay before animation starts (ms). |
| `distance` | `number` | `40` | Pixel offset used by slide presets. |

---

## Props Reference

Full TypeScript definitions are exported from the package root. All component props are documented inline with JSDoc, so editor hover tooltips work out of the box.

```ts
import type {
  AnimatedScrollViewProps,
  ParallaxConfig,
  FadeInViewProps,
  SlideInViewProps,
  SwipeableTabsProps,
  Tab,
  PageTransitionProps,
} from 'ramer-motion-native';
```

---

## Requirements

| Dependency | Minimum version |
|------------|-----------------|
| React | 18.0.0 |
| React Native | 0.72.0 |
| react-native-reanimated | 3.0.0 |
| react-native-gesture-handler | 2.0.0 |

---

## Contributing

Pull requests are welcome. Please open an issue first to discuss what you would like to change. Make sure all existing tests pass before submitting.

---

## License

[Apache 2.0](LICENSE)
