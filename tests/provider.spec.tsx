import { jest } from '@jest/globals';
import { render } from '@testing-library/react';
import { ComponentType, memo, useEffect } from 'react';
import '@testing-library/jest-dom';

import { createSelectableContext, ObjectCompareFunc, ObjectSelectFunc } from '../src/createSelectableContext';

interface TestValueShape {
  count: number;
}

const { SelectableProvider, useSelectableContext } = createSelectableContext<TestValueShape>();

interface ConsumerProps<T> {
  selectFn: ObjectSelectFunc<TestValueShape, T>;
  compareFn?: ObjectCompareFunc<T>;
}

const getConsumer = <T extends unknown>(): [ComponentType<ConsumerProps<T>>, { update: number }] => {
  const counters = {
    update: 0,
  };

  const Consumer = memo(function Consumer({ selectFn, compareFn }: ConsumerProps<T>): JSX.Element | null {
    useSelectableContext(selectFn, compareFn);

    useEffect(() => {
      counters.update += 1;
    });

    return null;
  });

  return [Consumer, counters];
};

const identity = (v: unknown): unknown => v;
const alwaysTrue = (): boolean => true;

describe('createSelectableProvider', () => {
  it('should throw if the hook is used without the context', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    const [Consumer] = getConsumer();

    expect(() =>
      render(
        <Consumer
          selectFn={identity}
          compareFn={alwaysTrue}
        />,
      ),
    ).toThrowError(/context not found/i);
    spy.mockRestore();
  });

  describe('selectFn', () => {
    it("should use provided 'selectFn'", () => {
      const selectFn = jest.fn(identity);
      const [Consumer] = getConsumer();

      render(
        <SelectableProvider value={{ count: 0 }}>
          <Consumer
            selectFn={selectFn}
            compareFn={alwaysTrue}
          />
        </SelectableProvider>,
      );

      expect(selectFn).toHaveBeenCalled();
    });

    it("should rerender when 'selectFn' changes", () => {
      const [Consumer] = getConsumer();
      let selectFn = jest.fn(identity);

      const { rerender } = render(
        <SelectableProvider value={{ count: 0 }}>
          <Consumer
            selectFn={selectFn}
            compareFn={alwaysTrue}
          />
        </SelectableProvider>,
      );

      // Change reference
      selectFn = jest.fn(identity);

      rerender(
        <SelectableProvider value={{ count: 0 }}>
          <Consumer
            selectFn={selectFn}
            compareFn={alwaysTrue}
          />
        </SelectableProvider>,
      );

      expect(selectFn).toHaveBeenCalled();
    });
  });

  describe('compareFn', () => {
    it("should use provided 'compareFn'", () => {
      const compareFn = jest.fn(alwaysTrue);
      const [Consumer] = getConsumer();

      render(
        <SelectableProvider value={{ count: 0 }}>
          <Consumer
            selectFn={identity}
            compareFn={compareFn}
          />
        </SelectableProvider>,
      );

      expect(compareFn).toHaveBeenCalled();
    });

    it("should rerender when 'compareFn' changes", () => {
      const [Consumer] = getConsumer();
      let compareFn = jest.fn(alwaysTrue);

      const { rerender } = render(
        <SelectableProvider value={{ count: 0 }}>
          <Consumer
            selectFn={identity}
            compareFn={compareFn}
          />
        </SelectableProvider>,
      );

      // Change reference
      compareFn = jest.fn(alwaysTrue);

      rerender(
        <SelectableProvider value={{ count: 0 }}>
          <Consumer
            selectFn={identity}
            compareFn={compareFn}
          />
        </SelectableProvider>,
      );

      expect(compareFn).toHaveBeenCalled();
    });

    it("should rerender when 'compareFn' returns false", () => {
      const [Consumer, counters] = getConsumer();
      const compareFn = jest.fn(() => true);

      const { rerender } = render(
        <SelectableProvider value={{ count: 0 }}>
          <Consumer
            selectFn={identity}
            compareFn={compareFn}
          />
        </SelectableProvider>,
      );

      expect(counters.update).toStrictEqual(1);
      compareFn.mockImplementation(() => false);

      rerender(
        <SelectableProvider value={{ count: 1 }}>
          <Consumer
            selectFn={identity}
            compareFn={compareFn}
          />
        </SelectableProvider>,
      );

      expect(counters.update).toStrictEqual(2);
    });

    it("should call 'compareFn' with the result of 'selectFn'", () => {
      const [Consumer] = getConsumer();
      const selectFn = jest.fn((obj: TestValueShape) => obj.count);
      const compareFn = jest.fn(alwaysTrue);

      const { rerender } = render(
        <SelectableProvider value={{ count: 0 }}>
          <Consumer
            selectFn={selectFn}
            compareFn={compareFn}
          />
        </SelectableProvider>,
      );

      expect(compareFn).toHaveBeenCalledWith(0, 0);

      rerender(
        <SelectableProvider value={{ count: 1 }}>
          <Consumer
            selectFn={selectFn}
            compareFn={compareFn}
          />
        </SelectableProvider>,
      );

      expect(compareFn).toHaveBeenCalledWith(0, 1);
    });
  });
});
