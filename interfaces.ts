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
  id: string;
  username: string;
  title: string | null;
  bio: string | null;
  points: number;
}

export interface AuthState {
  user: UserMe;
  authenticated: boolean | null;
}

export interface State {
  auth: AuthState;
}

export type FeedbackType = 'bad' | 'neutral' | 'good' | '';
