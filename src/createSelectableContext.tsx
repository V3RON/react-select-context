import { createContext, ReactNode, useRef, useContext, useEffect, useState, useCallback } from 'react';
import { shallow } from './compare';
import { SyncEmitter, useSyncEmitter } from './utils';

export type ObjectSelectFunc<T, Y> = (obj: T) => Y;
export type ObjectCompareFunc<T> = (a: T, b: T) => boolean;
interface SelectableProviderProps<T> {
  children: ReactNode;
  value: T;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createSelectableContext = <T extends object>() => {
  const SelectableContext = createContext<{
    emitter: SyncEmitter<T>;
    value: T;
  } | null>(null);

  const SelectableProvider = ({ children, value }: SelectableProviderProps<T>): JSX.Element => {
    const emitter = useSyncEmitter();
    const contextValueRef = useRef({
      emitter,
      value,
    });

    /* Sync value and emit 'update' event */
    useEffect(() => {
      contextValueRef.current.value = value;
      emitter.emit('update', value);
    }, [value, emitter]);

    return <SelectableContext.Provider value={contextValueRef.current}>{children}</SelectableContext.Provider>;
  };

  const useSelectableContext = <Y extends unknown>(
    selectFunc: ObjectSelectFunc<T, Y>,
    compareFunc: ObjectCompareFunc<Y> = shallow,
  ): Y => {
    const ctx = useContext(SelectableContext);

    if (ctx === null) {
      throw new Error('Context not found!');
    }

    const [selectedState, setSelectedState] = useState<Y>(() => selectFunc(ctx.value));

    const update = useCallback(
      (newValue: T) => {
        setSelectedState((oldState) => {
          const newState = selectFunc(newValue);
          return compareFunc(oldState, newState) ? oldState : newState;
        });
      },
      [selectFunc, compareFunc],
    );

    /* Run on data update */
    useEffect(() => {
      return ctx.emitter.on('update', update);
    }, [ctx, update]);

    /* Run on select/compare update */
    useEffect(() => {
      update(ctx.value);
    }, [ctx, update]);

    return selectedState;
  };

  return { SelectableProvider, useSelectableContext };
};
