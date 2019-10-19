import { Dispatch, MutableRefObject, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { State } from '../../interfaces';

interface UseHandleClickOutside {
  node: MutableRefObject<any>;
  onSelfClick: () => Dispatch<AnyAction>;
}

/*
 * This is a dynamic hook for handling click events outside
 * the given element for all widgets throughout the app.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useHandleClickOutside = (
  action: any,
  elementState: boolean
): UseHandleClickOutside => {
  const node = useRef<any>(); // eslint-disable-line
  const { authMenuOpen, searchInputOpen } = useSelector((state: State) => state.ui);
  const dispatch = useDispatch();

  // Dynamically close which ever element is being used.
  const handleClickOutside = (e: Event): void => {
    if (!node.current.contains(e.target)) {
      dispatch(action(false));
    }
  };

  useEffect(() => {
    if (elementState) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [authMenuOpen, searchInputOpen]);

  return { node, onSelfClick: () => dispatch(action(!elementState)) };
};
