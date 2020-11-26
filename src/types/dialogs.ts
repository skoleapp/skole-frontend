import { SyntheticEvent } from 'react';

export interface DialogHeaderProps {
  text?: string;
  onCancel: (e: SyntheticEvent) => void;
  headerLeft?: JSX.Element;
}
