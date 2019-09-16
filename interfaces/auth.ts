export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface LoginFormValues {
  usernameOrEmail: string;
  password: string;
}

export interface FormFieldProps {
  field: any; // eslint-disable-line  @typescript-eslint/no-explicit-any
  label: string;
}
