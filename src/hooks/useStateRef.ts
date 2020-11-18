import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

// A hook that allows using a mutable state.
export const useStateRef = <T>(
  initialValue: T
): [MutableRefObject<T>, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState(initialValue);
  const stateRef = useRef(value);

  useEffect(() => {
    stateRef.current = value;
  }, [value]);

  return [stateRef, setValue];
};
