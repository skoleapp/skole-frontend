export type FeedbackType = 'bad' | 'neutral' | 'good' | '';
export type FormErrors = any;
export type FormCompleted = any;

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
}

export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormValues {
  usernameOrEmail: string;
  password: string;
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

export interface UploadResourceFormValues {
  resourceTitle: string;
  resourceType: string;
  courseId: string;
  resource: string;
}

export interface DeleteAccountFormValues {
  password: string;
}
