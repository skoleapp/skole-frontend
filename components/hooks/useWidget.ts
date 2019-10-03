import { MutableRefObject, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { closeWidgets, toggleAuthMenu, toggleSearchInput } from '../../redux';

/*
 * This is a dynamic hook for handling click events outside
 * the given element for all widgets throughout the app.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useWidget = (element: string): MutableRefObject<any> => {
  const node = useRef<any>(); // eslint-disable-line
  const { authMenuOpen, searchInputOpen } = useSelector((state: State) => state.ui);
  const dispatch = useDispatch();

  // Dynamically close which ever element is being used.
  const handleClickOutside = (e: Event): void => {
    if (!node.current.contains(e.target)) {
      switch (element) {
        case 'auth-menu':
          dispatch(toggleAuthMenu(false));
          break;
        case 'search-input':
          dispatch(toggleSearchInput(false));
          break;
        default:
          dispatch(closeWidgets());
      }
    }
  };

  const getElementState = (element: string): boolean => {
    switch (element) {
      case 'auth-menu':
        return authMenuOpen;
      case 'search-input':
        return searchInputOpen;
      default:
        return false;
    }
  };

  useEffect(() => {
    const elementState = getElementState(element);

    if (elementState) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [authMenuOpen, searchInputOpen]);

  return node;
};
