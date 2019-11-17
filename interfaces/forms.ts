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
  courseName: string;
  courseCode: string;
  subjectId: string;
  schoolId: string;
}

export interface FilterSchoolsFormValues {
  schoolType: string | string[];
  schoolName: string | string[];
  schoolCity: string | string[];
  schoolCountry: string | string[];
}

export interface FilterSubjectsFormValues {
  schoolId: string | string[];
}

export interface FilterCoursesFormValues {
  courseName: string | string[];
  courseCode: string | string[];
  subjectId: string | string[];
  schoolId: string | string[];
}
