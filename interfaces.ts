import { SvgIconComponent } from '@material-ui/icons';
import ApolloClient from 'apollo-client';
import { NextPageContext } from 'next';
import { Store } from 'redux';

export interface SkoleContext extends NextPageContext {
  apolloClient: ApolloClient<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  reduxStore: Store;
  userMe: UserMe;
}

export interface FormErrors {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  general: string;
}

export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  general: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
  general: string;
}

export interface FormFieldProps {
  field: any; // eslint-disable-line  @typescript-eslint/no-explicit-any
  label: string;
}

export interface FeedbackFormValues {
  comment: string;
}

export interface UserMe {
  id: string | null;
  username: string | null;
  email: string | null;
  title: string | null;
  bio: string | null;
  points: number | null;
  language: string | null;
}

export interface PublicUser {
  id: string | null;
  username: string | null;
  title: string | null;
  bio: string | null;
  points: number | null;
  language: string | null;
}

export interface AuthState {
  user: UserMe;
  authenticated: boolean | null;
}

export interface State {
  auth: AuthState;
}

export interface UserPageProps {
  user: PublicUser | null;
}

export interface IconProps {
  icon: SvgIconComponent;
  onClick?: () => void;
}

export type FeedbackType = 'bad' | 'neutral' | 'good' | '';
