export type FeedbackType = 'bad' | 'neutral' | 'good' | '';
export type FormErrors = any;
export type FormCompleted = any;

export interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateProfileFormValues {
  username: string;
  email: string;
  title: string;
  bio: string;
  avatar: string;
}

export interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInFormValues {
  usernameOrEmail: string;
  password: string;
}

export interface CreateCourseFormValues {
  courseName: string;
  courseCode: string;
  subject: string;
  school: string;
  general: string;
}

export interface FilterSearchResultsFormValues {
  courseName: string;
  courseCode: string;
  schoolName: string;
  subjectName: string;
  schoolType: string;
  countryName: string;
  cityName: string;
}

export interface UploadResourceFormValues {
  resourceTitle: string;
  resourceType: string;
  course: string;
  resource: string;
}

export interface DeleteAccountFormValues {
  password: string;
}
