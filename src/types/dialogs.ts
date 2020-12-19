import { SyntheticEvent } from 'react';

export interface DialogHeaderProps {
  text?: string;
  onCancel: (e: SyntheticEvent) => void;
  cancelLeft?: boolean; // Render cancel button on left side.
  headerLeft?: JSX.Element | false;
  headerCenter?: JSX.Element | false;
  headerRight?: JSX.Element | false;
}
