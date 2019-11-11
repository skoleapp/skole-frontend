import ApolloClient from 'apollo-client';
import { NextPageContext } from 'next';
import { Store } from 'redux';

export interface SkoleContext extends NextPageContext {
  apolloClient: ApolloClient<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  reduxStore: Store;
  userMe: UserMe;
}

export interface UserMe {
  id: string | null;
  username: string | null;
  email: string | null;
  title: string | null;
  bio: string | null;
  avatar: string | null;
  points: number | null;
  language: string | null;
}

export interface PublicUser {
  id: string;
  username: string;
  title: string | null;
  bio: string | null;
  points: number;
  avatar: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  subject: number;
  school: number;
}

export interface School {
  id: number;
  schoolType: string;
  name: string;
  city: string;
  country: string;
  subjects: Subject[] | null;
  courses: Course[] | null;
}

export interface Subject {
  id: number;
  name: string;
}

export interface AuthState {
  user: UserMe;
  authenticated: boolean | null;
  loading: boolean | null;
  error: string | null;
}

export interface State {
  auth: AuthState;
}

export type FeedbackType = 'bad' | 'neutral' | 'good' | '';

export interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateUserFormValues {
  username: string;
  email: string;
  title: string;
  bio: string;
  avatar: string;
  language: string;
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
  usernameOrEmail: string;
  password: string;
  general: string;
}

export interface FeedbackFormValues {
  comment: string;
}

export interface CreateCourseFormValues {
  name: string;
  code: string;
  subject: string;
  school: string;
}
