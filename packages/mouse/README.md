---
Name: mouse
Stage: 2
Package: "@solid-primitives/mouse"
Primitives: createMousePosition, createMouseToElement, createMouseInElement, createMouseOnScreen
Category: Inputs
---

# @solid-primitives/mouse

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=for-the-badge)](https://lerna.js.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-primitives/mouse?style=for-the-badge)](https://bundlephobia.com/package/@solid-primitives/mouse)
[![size](https://img.shields.io/npm/v/@solid-primitives/mouse?style=for-the-badge)](https://www.npmjs.com/package/@solid-primitives/mouse)

A collection of primitives, capturing current mouse cursor position, and helping to deal with common usecases:

- [`createMousePosition`](#createMousePosition) - Listens to the global mouse events, providing a reactive up-to-date position of the cursor on the page.
- [`createMouseToElement`](#createMouseToElement) - Provides an autoupdating position relative to a provided element. It can be used with existing position signals, or left to get the current cursor position itself.
- [`createMouseInElement`](#createMouseInElement) - An alternative to `createMouseToElement`, that listens to mouse (and touch) events only inside the element. Provides information of position and if is the element being currently hovered.
- [`createMouseOnScreen`](#createMouseOnScreen) - Answers the question: _Is the cursor on screen?_

## `createMousePosition`

Listens to the global mouse events, providing a reactive up-to-date position of the cursor on the page.

### Usage

```ts
const [{ x, y, sourceType }, { stop, start }] = createMousePosition({ touch: false });
// listening to touch events is enabled by default
```

### Types

```ts
function createMousePosition(options: MouseOptions = {}): [
  getters: {
    x: Accessor<number>;
    y: Accessor<number>;
    sourceType: Accessor<MouseSourceType>;
  },
  actions: {
    start: Fn;
    stop: Fn;
  }
];
interface MouseOptions {
  /**
   * Listen to `touchmove` events
   * @default true
   */
  touch?: boolean;
  /**
   * Initial values
   * @default { x:0, y:0 }
   */
  initialValue?: Position;
  /**
   * If enabled, position will be updated on touchmove event.
   * @default true
   */
  followTouch?: boolean;
}
interface Position {
  x: number;
  y: number;
}
type MouseSourceType = "mouse" | "touch" | null;
```

## `createMouseToElement`

Provides an autoupdating position relative to a provided element. It can be used with existing position signals, or left to get the current cursor position itself.

### Usage

```ts
const [{ x, y, top, left, width, height, isInside }, manualUpdate] = createMouseToElement(
  () => myRef
);
// If position argument is left undefined, it will use
// createMousePosition internally to track the cursor position.

// But if you are already tracking the mouse position yourself, or with createMousePosition.
// You can pass it to createMouseToElement to avoid additional performance payload.
const [mouse] = createMousePosition();
const [{ x, y, isInside }] = createMouseToElement(el, mouse);

// This also works when you are applying some transformations to the position, or debouncing it.
const myPos = createMemo(() => {
  /* do sth with the mouse position */
});
const [{ x, y, isInside }] = createMouseToElement(el, myPos);
```

### Types

```ts
function createMouseToElement(
  element: MaybeAccessor<Element>,
  pos?: Accessor<Position> | { x: MaybeAccessor<number>; y: MaybeAccessor<number> },
  options: PositionToElementOptions = {}
): [
  getters: {
    x: Accessor<number>;
    y: Accessor<number>;
    top: Accessor<number>;
    left: Accessor<number>;
    width: Accessor<number>;
    height: Accessor<number>;
    isInside: Accessor<boolean>;
  },
  update: Fn
];
interface Position {
  x: number;
  y: number;
}
interface PositionToElementOptions extends MouseOptions {
  initialValue?: {
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
  };
}
```

## `createMouseInElement`

An alternative to [`createMouseToElement`](#createMouseToElement), that listens to mouse _(and touch)_ events only inside the element. Provides information of position and if is the element being currently hovered.

### Usage

```ts
const [{ x, y, sourceType, isInside }, { stop, start }] = createMouseInElement(() => myRef, {
  followTouch: false
});
// Same way as createMousePosition:
// the "touch", and "foullowTouch" settings are enabled by default
```

### Types

```ts
function createMouseInElement(
  element: MaybeAccessor<HTMLElement>,
  options: MouseOptions = {}
): [
  getters: {
    x: Accessor<number>;
    y: Accessor<number>;
    sourceType: Accessor<MouseSourceType>;
    isInside: Accessor<boolean>;
  },
  actions: {
    stop: Fn;
    start: Fn;
  }
];
type MouseSourceType = "mouse" | "touch" | null;
```

## `createMouseOnScreen`

Answers the question: _Is the cursor on screen?_

### Usage

```ts
const [isMouseOnScreen, { start, stop }] = createMouseOnScreen(true);
```

### Types

```ts
function createMouseOnScreen(
  initialValue?: boolean
): [onScreen: Accessor<boolean>, actions: { stop: Fn; start: Fn }];
function createMouseOnScreen(
  options?: MouseOnScreenOptions
): [onScreen: Accessor<boolean>, actions: { stop: Fn; start: Fn }];

interface MouseOnScreenOptions {
  /**
   * Listen to touch events
   * @default true
   */
  touch?: boolean;
  /**
   * Initial value
   * @default false
   */
  initialValue?: boolean;
}
```

## Demo

https://codesandbox.io/s/solid-primitives-mouse-p10s5?file=/index.tsx

## Changelog

<details>
<summary><b>Expand Changelog</b></summary>

1.0.0

Eelease as a Stage-2 primitive.

</details>