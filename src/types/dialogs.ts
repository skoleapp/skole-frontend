import { DialogProps } from '@material-ui/core';
import { SyntheticEvent } from 'react';

export interface DialogHeaderProps {
  text?: string;
  onCancel: (e: SyntheticEvent) => void;
  renderHeaderLeft?: JSX.Element | false;
  headerCenter?: JSX.Element | false;
  renderHeaderRight?: JSX.Element | false;
}

export interface SkoleDialogProps extends DialogProps {
  list?: boolean; // Specify whether a list is rendered with modified spacings.
}
