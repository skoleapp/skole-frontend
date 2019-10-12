import { User } from './store';

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

export interface SearchFormProps {
  search: string;
}

export interface FeedbackFormValues {
  comment: string;
}

export type AnyForm =
  | LoginFormValues
  | RegisterFormValues
  | SearchFormProps
  | User
  | FeedbackFormValues;
