import { SyntheticEvent } from 'react';

export interface DialogHeaderProps {
  text?: string;
  onCancel: (e: SyntheticEvent) => void;
  headerLeft?: JSX.Element | false;
  headerCenter?: JSX.Element | false;
  headerRight?: JSX.Element | false;
}
