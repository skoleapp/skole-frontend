import { Auth } from './auth';
import { Notification } from './notifications';

export interface State {
  auth: Auth;
  notification: Notification;
}
