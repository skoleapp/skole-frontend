import { Auth } from './auth';
import { Notifications } from './notifications';

export interface State {
  auth: Auth;
  notifications: Notifications;
}
