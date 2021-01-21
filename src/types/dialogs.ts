import { DialogProps } from '@material-ui/core/Dialog';
import { SyntheticEvent } from 'react';

export interface DialogHeaderProps {
  text?: JSX.Element | string;
  onCancel: (e: SyntheticEvent) => void;
  renderHeaderLeft?: JSX.Element | false;
  headerCenter?: JSX.Element | false;
  renderHeaderRight?: JSX.Element | false;
}

export interface SkoleDialogProps extends DialogProps {
  list?: boolean; // Specify whether a list is rendered with modified spacings.
}
