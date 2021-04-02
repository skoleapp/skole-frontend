import { DialogProps } from '@material-ui/core/Dialog';
import { UserObjectType } from 'generated';

export interface DialogHeaderProps {
  text?: JSX.Element | string;
  emoji?: string | false;
  onCancel: () => void;
  renderHeaderLeft?: JSX.Element | false;
  headerCenter?: JSX.Element | false;
  renderHeaderRight?: JSX.Element | false;
}

export interface SkoleDialogProps extends DialogProps {
  list?: boolean; // Specify whether a list is rendered with modified spacings.
  paperClasses?: string;
}

export interface ShareDialogParams {
  header?: string;
  title?: string;
  text?: string;
  linkSuffix?: string;
  customLink?: string;
}

interface DeleteActionParams {
  text?: string;
  callback?: () => void;
  disabled?: boolean;
}

export interface ActionsDialogParams {
  shareText?: string;
  shareDialogParams?: ShareDialogParams;
  deleteActionParams?: DeleteActionParams;
  renderCustomActions?: Array<JSX.Element | false>;
  hideShareAction?: boolean;
  hideDeleteAction?: boolean;
  hideReportAction?: boolean;
}

interface InfoDialogItem {
  label: string;
  value?: JSX.Element | JSX.Element[] | string | number | boolean;
}

export interface InfoDialogParams {
  header: JSX.Element | string;
  emoji?: string | false;
  creator?: Partial<UserObjectType> | null;
  created?: string;
  infoItems: InfoDialogItem[];
}
