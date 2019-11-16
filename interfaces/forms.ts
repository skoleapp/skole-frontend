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

export interface FilterSchoolsFormValues {
  schoolType: string | string[];
  name: string | string[];
  city: string | string[];
  country: string | string[];
}
