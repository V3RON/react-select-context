# react-select-context

![](https://img.shields.io/github/actions/workflow/status/v3ron/react-select-context/release)
![](https://img.shields.io/npm/v/@v3ron/react-select-context)

State selection pattern for React Context API.

## 📝 Why?

The context API has one major drawback. It updates all consumers when provided value
changes, no matter what part of the state is necessary for the consumer to work properly.
In order to reduce the performance penalty caused by this behavior we split the context
into several smaller ones. This minimizes the number of components rerendering on state update.

This package allows you store large objects in a context and limit updates to only those
components, which are really interested in an updated portion of data.

## 🚀 Installation

```
npm install @v3ron/react-select-context --save
yarn add @v3ron/react-select-context
pnpm add @v3ron/react-select-context
```

## 🏗️ Example

```tsx
import { useState, useCallback } from "react";
import { createSelectableContext } from "./createSelectableContext";

const { SelectableProvider, useSelectableContext } = createSelectableContext<{ count: number }>();

const Consumer = (): JSX.Element => {
  const count = useSelectableContext(useCallback((state) => state.count));
  
  return (
    <div>{count}</div>
  );
}

const App = (): JSX.Element => {
  const [count, setCount] = useState(0);

  return (
    <SelectableProvider value={{ count }}>
      <button onClick={() => setCount(n => n + 1)}>Update</button>
      <Consumer />
    </SelectableProvider>
  );
}
```

## 🔧 API

### createSelectableProvider

Creates a selectable context and returns its provider and a hook, which can be used to interact
with it.

### SelectableProvider

A modified context provider, which can be used with `useSelectableContext` to access the context data.

### useSelectableContext

Gives access to the selectable context. It accepts two arguments:
* `selectFn` - a selector function
* `compareFn` - a comparator (defaults to shallow)

Remember to memoize both functions! This way you will get as little rerenders as possible.


