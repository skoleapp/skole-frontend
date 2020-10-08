import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: any;
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<UserObjectType>;
  userMe?: Maybe<UserObjectType>;
  autocompleteSubjects?: Maybe<Array<Maybe<SubjectObjectType>>>;
  subject?: Maybe<SubjectObjectType>;
  autocompleteSchoolTypes?: Maybe<Array<Maybe<SchoolTypeObjectType>>>;
  schoolType?: Maybe<SchoolTypeObjectType>;
  autocompleteSchools?: Maybe<Array<Maybe<SchoolObjectType>>>;
  school?: Maybe<SchoolObjectType>;
  resourceTypes?: Maybe<Array<Maybe<ResourceTypeObjectType>>>;
  autocompleteResourceTypes?: Maybe<Array<Maybe<ResourceTypeObjectType>>>;
  resource?: Maybe<ResourceObjectType>;
  searchCourses?: Maybe<PaginatedCourseObjectType>;
  autocompleteCourses?: Maybe<Array<Maybe<CourseObjectType>>>;
  course?: Maybe<CourseObjectType>;
  autocompleteCountries?: Maybe<Array<Maybe<CountryObjectType>>>;
  country?: Maybe<CountryObjectType>;
  autocompleteCities?: Maybe<Array<Maybe<CityObjectType>>>;
  city?: Maybe<CityObjectType>;
};


export type QueryUserArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryAutocompleteSubjectsArgs = {
  name?: Maybe<Scalars['String']>;
};


export type QuerySubjectArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QuerySchoolTypeArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryAutocompleteSchoolsArgs = {
  name?: Maybe<Scalars['String']>;
};


export type QuerySchoolArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryResourceArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QuerySearchCoursesArgs = {
  courseName?: Maybe<Scalars['String']>;
  courseCode?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['ID']>;
  school?: Maybe<Scalars['ID']>;
  schoolType?: Maybe<Scalars['ID']>;
  country?: Maybe<Scalars['ID']>;
  city?: Maybe<Scalars['ID']>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
  ordering?: Maybe<Scalars['String']>;
};


export type QueryAutocompleteCoursesArgs = {
  school?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
};


export type QueryCourseArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryCountryArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryCityArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type UserObjectType = {
  __typename?: 'UserObjectType';
  id: Scalars['ID'];
  username: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  bio: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Int']>;
  created: Scalars['DateTime'];
  verified?: Maybe<Scalars['Boolean']>;
  activity?: Maybe<Array<Maybe<ActivityObjectType>>>;
  createdCourses: Array<CourseObjectType>;
  createdResources: Array<ResourceObjectType>;
  avatarThumbnail?: Maybe<Scalars['String']>;
  school?: Maybe<SchoolObjectType>;
  subject?: Maybe<SubjectObjectType>;
  rank?: Maybe<Scalars['String']>;
  badges?: Maybe<Array<Maybe<BadgeObjectType>>>;
  starredCourses?: Maybe<Array<Maybe<CourseObjectType>>>;
  starredResources?: Maybe<Array<Maybe<ResourceObjectType>>>;
};


export type ActivityObjectType = {
  __typename?: 'ActivityObjectType';
  id: Scalars['ID'];
  targetUser?: Maybe<UserObjectType>;
  course?: Maybe<CourseObjectType>;
  resource?: Maybe<ResourceObjectType>;
  comment?: Maybe<CommentObjectType>;
  read?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
};

export type CourseObjectType = {
  __typename?: 'CourseObjectType';
  id: Scalars['ID'];
  name: Scalars['String'];
  code: Scalars['String'];
  subjects: Array<SubjectObjectType>;
  school: SchoolObjectType;
  user?: Maybe<UserObjectType>;
  modified: Scalars['DateTime'];
  created: Scalars['DateTime'];
  comments: Array<CommentObjectType>;
  resources: Array<ResourceObjectType>;
  starred?: Maybe<Scalars['Boolean']>;
  score?: Maybe<Scalars['Int']>;
  vote?: Maybe<VoteObjectType>;
  commentCount?: Maybe<Scalars['Int']>;
  resourceCount?: Maybe<Scalars['Int']>;
};

export type SubjectObjectType = {
  __typename?: 'SubjectObjectType';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type SchoolObjectType = {
  __typename?: 'SchoolObjectType';
  id: Scalars['ID'];
  schoolType?: Maybe<SchoolTypeObjectType>;
  city?: Maybe<CityObjectType>;
  courses: Array<CourseObjectType>;
  name?: Maybe<Scalars['String']>;
  country?: Maybe<CountryObjectType>;
  subjects?: Maybe<Array<Maybe<SubjectObjectType>>>;
};

export type SchoolTypeObjectType = {
  __typename?: 'SchoolTypeObjectType';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type CityObjectType = {
  __typename?: 'CityObjectType';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type CountryObjectType = {
  __typename?: 'CountryObjectType';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type CommentObjectType = {
  __typename?: 'CommentObjectType';
  id: Scalars['ID'];
  user?: Maybe<UserObjectType>;
  text: Scalars['String'];
  attachment: Scalars['String'];
  course?: Maybe<CourseObjectType>;
  resource?: Maybe<ResourceObjectType>;
  comment?: Maybe<CommentObjectType>;
  modified: Scalars['DateTime'];
  created: Scalars['DateTime'];
  replyComments: Array<CommentObjectType>;
  score?: Maybe<Scalars['Int']>;
  vote?: Maybe<VoteObjectType>;
};

export type ResourceObjectType = {
  __typename?: 'ResourceObjectType';
  id: Scalars['ID'];
  resourceType?: Maybe<ResourceTypeObjectType>;
  title: Scalars['String'];
  file: Scalars['String'];
  date: Scalars['Date'];
  course: CourseObjectType;
  downloads: Scalars['Int'];
  user?: Maybe<UserObjectType>;
  modified: Scalars['DateTime'];
  created: Scalars['DateTime'];
  comments: Array<CommentObjectType>;
  starred?: Maybe<Scalars['Boolean']>;
  score?: Maybe<Scalars['Int']>;
  vote?: Maybe<VoteObjectType>;
  school?: Maybe<SchoolObjectType>;
};

export type ResourceTypeObjectType = {
  __typename?: 'ResourceTypeObjectType';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};


export type VoteObjectType = {
  __typename?: 'VoteObjectType';
  id: Scalars['ID'];
  user: UserObjectType;
  status?: Maybe<Scalars['Int']>;
  comment?: Maybe<CommentObjectType>;
  course?: Maybe<CourseObjectType>;
  resource?: Maybe<ResourceObjectType>;
};

export type BadgeObjectType = {
  __typename?: 'BadgeObjectType';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type PaginatedCourseObjectType = {
  __typename?: 'PaginatedCourseObjectType';
  page?: Maybe<Scalars['Int']>;
  pages?: Maybe<Scalars['Int']>;
  hasNext?: Maybe<Scalars['Boolean']>;
  hasPrev?: Maybe<Scalars['Boolean']>;
  count?: Maybe<Scalars['Int']>;
  objects?: Maybe<Array<Maybe<CourseObjectType>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  performStar?: Maybe<StarredMutationPayload>;
  performVote?: Maybe<VoteMutationPayload>;
  /**
   * Register new user.
   * 
   * Check if there is an existing user with that email or username. Check that account
   * is not deactivated. By default set the user a unverified. After successful
   * registration send account verification email.
   */
  register?: Maybe<RegisterMutationPayload>;
  /**
   * Receive the token that was sent by email, if the token is valid, verify the
   * user's account.
   */
  verifyAccount?: Maybe<VerifyAccountMutationPayload>;
  /**
   * Sends verification email again.
   * 
   * Return error if a user with the provided email is not found.
   */
  resendVerificationEmail?: Maybe<ResendVerificationEmailMutationPayload>;
  /**
   * Send password reset email.
   * 
   * For non verified users, send an verification email instead. Return error if a user
   * with the provided email is not found.
   */
  sendPasswordResetEmail?: Maybe<SendPasswordResetEmailMutationPayload>;
  /**
   * Change user's password without old password.
   * 
   * Receive the token that was sent by email. Revoke refresh token and thus require the
   * user to log in with his new password.
   */
  resetPassword?: Maybe<ResetPasswordMutationPayload>;
  /**
   * Obtain JSON web token and user information.
   * 
   * Not verified users can still login.
   */
  login?: Maybe<LoginMutationPayload>;
  /**
   * Delete JSON web token cookie and logout.
   * 
   * This sets the `Set-Cookie` header so that the JWT token cookie gets automatically
   * deleted in frontend.
   */
  logout?: Maybe<LogoutMutation>;
  /** Update some user model fields. */
  updateUser?: Maybe<UpdateUserMutationPayload>;
  /**
   * Change account password when user knows the old password.
   * 
   * User must be verified.
   */
  changePassword?: Maybe<ChangePasswordMutationPayload>;
  /**
   * Delete account permanently.
   * 
   * The user must confirm his password.
   */
  deleteUser?: Maybe<DeleteUserMutationPayload>;
  createResource?: Maybe<CreateResourceMutationPayload>;
  updateResource?: Maybe<UpdateResourceMutationPayload>;
  deleteResource?: Maybe<DeleteResourceMutationPayload>;
  createCourse?: Maybe<CreateCourseMutationPayload>;
  deleteCourse?: Maybe<DeleteCourseMutationPayload>;
  createContactMessage?: Maybe<ContactMutationPayload>;
  createComment?: Maybe<CreateCommentMutationPayload>;
  updateComment?: Maybe<UpdateCommentMutationPayload>;
  deleteComment?: Maybe<DeleteCommentMutationPayload>;
  /** Mark a single activity read/unread and return the updated activity. */
  markActivityRead?: Maybe<MarkActivityReadMutationPayload>;
  /** Mark all activities of the given user as read. */
  markAllActivitiesRead?: Maybe<MarkAllActivitiesReadMutation>;
};


export type MutationPerformStarArgs = {
  input: StarredMutationInput;
};


export type MutationPerformVoteArgs = {
  input: VoteMutationInput;
};


export type MutationRegisterArgs = {
  input: RegisterMutationInput;
};


export type MutationVerifyAccountArgs = {
  input: VerifyAccountMutationInput;
};


export type MutationResendVerificationEmailArgs = {
  input: ResendVerificationEmailMutationInput;
};


export type MutationSendPasswordResetEmailArgs = {
  input: SendPasswordResetEmailMutationInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordMutationInput;
};


export type MutationLoginArgs = {
  input: LoginMutationInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserMutationInput;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordMutationInput;
};


export type MutationDeleteUserArgs = {
  input: DeleteUserMutationInput;
};


export type MutationCreateResourceArgs = {
  input: CreateResourceMutationInput;
};


export type MutationUpdateResourceArgs = {
  input: UpdateResourceMutationInput;
};


export type MutationDeleteResourceArgs = {
  input: DeleteResourceMutationInput;
};


export type MutationCreateCourseArgs = {
  input: CreateCourseMutationInput;
};


export type MutationDeleteCourseArgs = {
  input: DeleteCourseMutationInput;
};


export type MutationCreateContactMessageArgs = {
  input: ContactMutationInput;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentMutationInput;
};


export type MutationUpdateCommentArgs = {
  input: UpdateCommentMutationInput;
};


export type MutationDeleteCommentArgs = {
  input: DeleteCommentMutationInput;
};


export type MutationMarkActivityReadArgs = {
  input: MarkActivityReadMutationInput;
};

export type StarredMutationPayload = {
  __typename?: 'StarredMutationPayload';
  starred?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ErrorType = {
  __typename?: 'ErrorType';
  field: Scalars['String'];
  messages: Array<Scalars['String']>;
};

export type StarredMutationInput = {
  course?: Maybe<Scalars['ID']>;
  resource?: Maybe<Scalars['ID']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type VoteMutationPayload = {
  __typename?: 'VoteMutationPayload';
  vote?: Maybe<VoteObjectType>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  targetScore?: Maybe<Scalars['Int']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type VoteMutationInput = {
  status: Scalars['Int'];
  comment?: Maybe<Scalars['ID']>;
  course?: Maybe<Scalars['ID']>;
  resource?: Maybe<Scalars['ID']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

/**
 * Register new user.
 * 
 * Check if there is an existing user with that email or username. Check that account
 * is not deactivated. By default set the user a unverified. After successful
 * registration send account verification email.
 */
export type RegisterMutationPayload = {
  __typename?: 'RegisterMutationPayload';
  message?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type RegisterMutationInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

/**
 * Receive the token that was sent by email, if the token is valid, verify the
 * user's account.
 */
export type VerifyAccountMutationPayload = {
  __typename?: 'VerifyAccountMutationPayload';
  token?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  message?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type VerifyAccountMutationInput = {
  token?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

/**
 * Sends verification email again.
 * 
 * Return error if a user with the provided email is not found.
 */
export type ResendVerificationEmailMutationPayload = {
  __typename?: 'ResendVerificationEmailMutationPayload';
  email: Scalars['String'];
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  message?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ResendVerificationEmailMutationInput = {
  email: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

/**
 * Send password reset email.
 * 
 * For non verified users, send an verification email instead. Return error if a user
 * with the provided email is not found.
 */
export type SendPasswordResetEmailMutationPayload = {
  __typename?: 'SendPasswordResetEmailMutationPayload';
  email: Scalars['String'];
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  message?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type SendPasswordResetEmailMutationInput = {
  email: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

/**
 * Change user's password without old password.
 * 
 * Receive the token that was sent by email. Revoke refresh token and thus require the
 * user to log in with his new password.
 */
export type ResetPasswordMutationPayload = {
  __typename?: 'ResetPasswordMutationPayload';
  token?: Maybe<Scalars['String']>;
  newPassword: Scalars['String'];
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  message?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ResetPasswordMutationInput = {
  token?: Maybe<Scalars['String']>;
  newPassword: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

/**
 * Obtain JSON web token and user information.
 * 
 * Not verified users can still login.
 */
export type LoginMutationPayload = {
  __typename?: 'LoginMutationPayload';
  user?: Maybe<UserObjectType>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  message?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type LoginMutationInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

/**
 * Delete JSON web token cookie and logout.
 * 
 * This sets the `Set-Cookie` header so that the JWT token cookie gets automatically
 * deleted in frontend.
 */
export type LogoutMutation = {
  __typename?: 'LogoutMutation';
  deleted: Scalars['Boolean'];
};

/** Update some user model fields. */
export type UpdateUserMutationPayload = {
  __typename?: 'UpdateUserMutationPayload';
  user?: Maybe<UserObjectType>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  message?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateUserMutationInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  school?: Maybe<Scalars['ID']>;
  subject?: Maybe<Scalars['ID']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

/**
 * Change account password when user knows the old password.
 * 
 * User must be verified.
 */
export type ChangePasswordMutationPayload = {
  __typename?: 'ChangePasswordMutationPayload';
  message?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ChangePasswordMutationInput = {
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

/**
 * Delete account permanently.
 * 
 * The user must confirm his password.
 */
export type DeleteUserMutationPayload = {
  __typename?: 'DeleteUserMutationPayload';
  message?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteUserMutationInput = {
  password: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateResourceMutationPayload = {
  __typename?: 'CreateResourceMutationPayload';
  resource?: Maybe<ResourceObjectType>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  message?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateResourceMutationInput = {
  title: Scalars['String'];
  file: Scalars['String'];
  resourceType: Scalars['ID'];
  course: Scalars['ID'];
  date?: Maybe<Scalars['Date']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateResourceMutationPayload = {
  __typename?: 'UpdateResourceMutationPayload';
  resource?: Maybe<ResourceObjectType>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  message?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateResourceMutationInput = {
  title: Scalars['String'];
  resourceType: Scalars['ID'];
  date?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['ID']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteResourceMutationPayload = {
  __typename?: 'DeleteResourceMutationPayload';
  message?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteResourceMutationInput = {
  id?: Maybe<Scalars['ID']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateCourseMutationPayload = {
  __typename?: 'CreateCourseMutationPayload';
  course?: Maybe<CourseObjectType>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  message?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateCourseMutationInput = {
  name: Scalars['String'];
  code?: Maybe<Scalars['String']>;
  subjects?: Maybe<Array<Maybe<Scalars['ID']>>>;
  school: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteCourseMutationPayload = {
  __typename?: 'DeleteCourseMutationPayload';
  message?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteCourseMutationInput = {
  id?: Maybe<Scalars['ID']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ContactMutationPayload = {
  __typename?: 'ContactMutationPayload';
  subject: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  message?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ContactMutationInput = {
  subject: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  message: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateCommentMutationPayload = {
  __typename?: 'CreateCommentMutationPayload';
  comment?: Maybe<CommentObjectType>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  message?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateCommentMutationInput = {
  text?: Maybe<Scalars['String']>;
  attachment?: Maybe<Scalars['String']>;
  course?: Maybe<Scalars['ID']>;
  resource?: Maybe<Scalars['ID']>;
  comment?: Maybe<Scalars['ID']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateCommentMutationPayload = {
  __typename?: 'UpdateCommentMutationPayload';
  comment?: Maybe<CommentObjectType>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  message?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateCommentMutationInput = {
  text?: Maybe<Scalars['String']>;
  attachment?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteCommentMutationPayload = {
  __typename?: 'DeleteCommentMutationPayload';
  message?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteCommentMutationInput = {
  id?: Maybe<Scalars['ID']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

/** Mark a single activity read/unread and return the updated activity. */
export type MarkActivityReadMutationPayload = {
  __typename?: 'MarkActivityReadMutationPayload';
  activity?: Maybe<ActivityObjectType>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type MarkActivityReadMutationInput = {
  read?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

/** Mark all activities of the given user as read. */
export type MarkAllActivitiesReadMutation = {
  __typename?: 'MarkAllActivitiesReadMutation';
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  activities?: Maybe<Array<Maybe<ActivityObjectType>>>;
};

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register?: Maybe<(
    { __typename?: 'RegisterMutationPayload' }
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )>, login?: Maybe<(
    { __typename?: 'LoginMutationPayload' }
    & { user?: Maybe<(
      { __typename?: 'UserObjectType' }
      & Pick<UserObjectType, 'username' | 'email'>
    )>, errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login?: Maybe<(
    { __typename?: 'LoginMutationPayload' }
    & Pick<LoginMutationPayload, 'message'>
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type BackendLogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type BackendLogoutMutation = (
  { __typename?: 'Mutation' }
  & { logout?: Maybe<(
    { __typename?: 'LogoutMutation' }
    & Pick<LogoutMutation, 'deleted'>
  )> }
);

export type ResendVerificationEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ResendVerificationEmailMutation = (
  { __typename?: 'Mutation' }
  & { resendVerificationEmail?: Maybe<(
    { __typename?: 'ResendVerificationEmailMutationPayload' }
    & Pick<ResendVerificationEmailMutationPayload, 'message'>
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type VerifyAccountMutationVariables = Exact<{
  token?: Maybe<Scalars['String']>;
}>;


export type VerifyAccountMutation = (
  { __typename?: 'Mutation' }
  & { verifyAccount?: Maybe<(
    { __typename?: 'VerifyAccountMutationPayload' }
    & Pick<VerifyAccountMutationPayload, 'message'>
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type SendPasswordResetEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type SendPasswordResetEmailMutation = (
  { __typename?: 'Mutation' }
  & { sendPasswordResetEmail?: Maybe<(
    { __typename?: 'SendPasswordResetEmailMutationPayload' }
    & Pick<SendPasswordResetEmailMutationPayload, 'message'>
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type ResetPasswordMutationVariables = Exact<{
  token?: Maybe<Scalars['String']>;
  newPassword: Scalars['String'];
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & { resetPassword?: Maybe<(
    { __typename?: 'ResetPasswordMutationPayload' }
    & Pick<ResetPasswordMutationPayload, 'message'>
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type UpdateUserMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  school?: Maybe<Scalars['ID']>;
  subject?: Maybe<Scalars['ID']>;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser?: Maybe<(
    { __typename?: 'UpdateUserMutationPayload' }
    & Pick<UpdateUserMutationPayload, 'message'>
    & { user?: Maybe<(
      { __typename?: 'UserObjectType' }
      & Pick<UserObjectType, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'score' | 'created'>
    )>, errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type ChangePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword?: Maybe<(
    { __typename?: 'ChangePasswordMutationPayload' }
    & Pick<ChangePasswordMutationPayload, 'message'>
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type DeleteUserMutationVariables = Exact<{
  password: Scalars['String'];
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & { deleteUser?: Maybe<(
    { __typename?: 'DeleteUserMutationPayload' }
    & Pick<DeleteUserMutationPayload, 'message'>
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type PerformStarMutationVariables = Exact<{
  course?: Maybe<Scalars['ID']>;
  resource?: Maybe<Scalars['ID']>;
}>;


export type PerformStarMutation = (
  { __typename?: 'Mutation' }
  & { performStar?: Maybe<(
    { __typename?: 'StarredMutationPayload' }
    & Pick<StarredMutationPayload, 'starred'>
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type PerformVoteMutationVariables = Exact<{
  status: Scalars['Int'];
  comment?: Maybe<Scalars['ID']>;
  course?: Maybe<Scalars['ID']>;
  resource?: Maybe<Scalars['ID']>;
}>;


export type PerformVoteMutation = (
  { __typename?: 'Mutation' }
  & { performVote?: Maybe<(
    { __typename?: 'VoteMutationPayload' }
    & Pick<VoteMutationPayload, 'targetScore'>
    & { vote?: Maybe<(
      { __typename?: 'VoteObjectType' }
      & Pick<VoteObjectType, 'id' | 'status'>
    )>, errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type CreateCommentMutationVariables = Exact<{
  text: Scalars['String'];
  attachment?: Maybe<Scalars['String']>;
  course?: Maybe<Scalars['ID']>;
  resource?: Maybe<Scalars['ID']>;
  comment?: Maybe<Scalars['ID']>;
}>;


export type CreateCommentMutation = (
  { __typename?: 'Mutation' }
  & { createComment?: Maybe<(
    { __typename?: 'CreateCommentMutationPayload' }
    & Pick<CreateCommentMutationPayload, 'message'>
    & { comment?: Maybe<(
      { __typename?: 'CommentObjectType' }
      & Pick<CommentObjectType, 'id' | 'text' | 'attachment' | 'modified' | 'created' | 'score'>
      & { user?: Maybe<(
        { __typename?: 'UserObjectType' }
        & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
      )>, replyComments: Array<(
        { __typename?: 'CommentObjectType' }
        & Pick<CommentObjectType, 'id' | 'text' | 'attachment' | 'modified' | 'created' | 'score'>
        & { user?: Maybe<(
          { __typename?: 'UserObjectType' }
          & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
        )>, vote?: Maybe<(
          { __typename?: 'VoteObjectType' }
          & Pick<VoteObjectType, 'id' | 'status'>
        )> }
      )>, vote?: Maybe<(
        { __typename?: 'VoteObjectType' }
        & Pick<VoteObjectType, 'id' | 'status'>
      )> }
    )>, errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type DeleteCommentMutationVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type DeleteCommentMutation = (
  { __typename?: 'Mutation' }
  & { deleteComment?: Maybe<(
    { __typename?: 'DeleteCommentMutationPayload' }
    & Pick<DeleteCommentMutationPayload, 'message'>
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type CreateContactMessageMutationVariables = Exact<{
  subject: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  message: Scalars['String'];
}>;


export type CreateContactMessageMutation = (
  { __typename?: 'Mutation' }
  & { createContactMessage?: Maybe<(
    { __typename?: 'ContactMutationPayload' }
    & Pick<ContactMutationPayload, 'message'>
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type CreateCourseMutationVariables = Exact<{
  courseName: Scalars['String'];
  courseCode?: Maybe<Scalars['String']>;
  subjects?: Maybe<Array<Maybe<Scalars['ID']>>>;
  school: Scalars['ID'];
}>;


export type CreateCourseMutation = (
  { __typename?: 'Mutation' }
  & { createCourse?: Maybe<(
    { __typename?: 'CreateCourseMutationPayload' }
    & Pick<CreateCourseMutationPayload, 'message'>
    & { course?: Maybe<(
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id'>
    )>, errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type DeleteCourseMutationVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type DeleteCourseMutation = (
  { __typename?: 'Mutation' }
  & { deleteCourse?: Maybe<(
    { __typename?: 'DeleteCourseMutationPayload' }
    & Pick<DeleteCourseMutationPayload, 'message'>
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type CreateResourceMutationVariables = Exact<{
  resourceTitle: Scalars['String'];
  resourceType: Scalars['ID'];
  course: Scalars['ID'];
  file: Scalars['String'];
}>;


export type CreateResourceMutation = (
  { __typename?: 'Mutation' }
  & { createResource?: Maybe<(
    { __typename?: 'CreateResourceMutationPayload' }
    & Pick<CreateResourceMutationPayload, 'message'>
    & { resource?: Maybe<(
      { __typename?: 'ResourceObjectType' }
      & Pick<ResourceObjectType, 'id'>
    )>, errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type DeleteResourceMutationVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type DeleteResourceMutation = (
  { __typename?: 'Mutation' }
  & { deleteResource?: Maybe<(
    { __typename?: 'DeleteResourceMutationPayload' }
    & Pick<DeleteResourceMutationPayload, 'message'>
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type MarkActivityReadMutationVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
  read?: Maybe<Scalars['Boolean']>;
}>;


export type MarkActivityReadMutation = (
  { __typename?: 'Mutation' }
  & { markActivityRead?: Maybe<(
    { __typename?: 'MarkActivityReadMutationPayload' }
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>>, activity?: Maybe<(
      { __typename?: 'ActivityObjectType' }
      & Pick<ActivityObjectType, 'id' | 'description' | 'read'>
      & { targetUser?: Maybe<(
        { __typename?: 'UserObjectType' }
        & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
      )>, course?: Maybe<(
        { __typename?: 'CourseObjectType' }
        & Pick<CourseObjectType, 'id'>
      )>, resource?: Maybe<(
        { __typename?: 'ResourceObjectType' }
        & Pick<ResourceObjectType, 'id'>
      )>, comment?: Maybe<(
        { __typename?: 'CommentObjectType' }
        & Pick<CommentObjectType, 'id'>
      )> }
    )> }
  )> }
);

export type MarkAllActivitiesAsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkAllActivitiesAsReadMutation = (
  { __typename?: 'Mutation' }
  & { markAllActivitiesRead?: Maybe<(
    { __typename?: 'MarkAllActivitiesReadMutation' }
    & { errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>>, activities?: Maybe<Array<Maybe<(
      { __typename?: 'ActivityObjectType' }
      & Pick<ActivityObjectType, 'id' | 'description' | 'read'>
      & { targetUser?: Maybe<(
        { __typename?: 'UserObjectType' }
        & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
      )>, course?: Maybe<(
        { __typename?: 'CourseObjectType' }
        & Pick<CourseObjectType, 'id'>
      )>, resource?: Maybe<(
        { __typename?: 'ResourceObjectType' }
        & Pick<ResourceObjectType, 'id'>
      )>, comment?: Maybe<(
        { __typename?: 'CommentObjectType' }
        & Pick<CommentObjectType, 'id'>
      )> }
    )>>> }
  )> }
);

export type UserMeQueryVariables = Exact<{ [key: string]: never; }>;


export type UserMeQuery = (
  { __typename?: 'Query' }
  & { userMe?: Maybe<(
    { __typename?: 'UserObjectType' }
    & Pick<UserObjectType, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'score' | 'created' | 'verified'>
    & { school?: Maybe<(
      { __typename?: 'SchoolObjectType' }
      & Pick<SchoolObjectType, 'id' | 'name'>
    )>, subject?: Maybe<(
      { __typename?: 'SubjectObjectType' }
      & Pick<SubjectObjectType, 'id' | 'name'>
    )>, activity?: Maybe<Array<Maybe<(
      { __typename?: 'ActivityObjectType' }
      & Pick<ActivityObjectType, 'id' | 'description' | 'read'>
      & { targetUser?: Maybe<(
        { __typename?: 'UserObjectType' }
        & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
      )>, course?: Maybe<(
        { __typename?: 'CourseObjectType' }
        & Pick<CourseObjectType, 'id'>
      )>, resource?: Maybe<(
        { __typename?: 'ResourceObjectType' }
        & Pick<ResourceObjectType, 'id'>
      )>, comment?: Maybe<(
        { __typename?: 'CommentObjectType' }
        & Pick<CommentObjectType, 'id'>
      )> }
    )>>> }
  )> }
);

export type StarredQueryVariables = Exact<{ [key: string]: never; }>;


export type StarredQuery = (
  { __typename?: 'Query' }
  & { userMe?: Maybe<(
    { __typename?: 'UserObjectType' }
    & { starredCourses?: Maybe<Array<Maybe<(
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'score' | 'commentCount' | 'resourceCount'>
      & { user?: Maybe<(
        { __typename?: 'UserObjectType' }
        & Pick<UserObjectType, 'id' | 'username'>
      )> }
    )>>>, starredResources?: Maybe<Array<Maybe<(
      { __typename?: 'ResourceObjectType' }
      & Pick<ResourceObjectType, 'id' | 'title' | 'score' | 'date'>
      & { resourceType?: Maybe<(
        { __typename?: 'ResourceTypeObjectType' }
        & Pick<ResourceTypeObjectType, 'id'>
      )> }
    )>>> }
  )>, resourceTypes?: Maybe<Array<Maybe<(
    { __typename?: 'ResourceTypeObjectType' }
    & Pick<ResourceTypeObjectType, 'id' | 'name'>
  )>>> }
);

export type UserQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'UserObjectType' }
    & Pick<UserObjectType, 'id' | 'username' | 'title' | 'bio' | 'avatar' | 'score' | 'created' | 'verified' | 'rank'>
    & { badges?: Maybe<Array<Maybe<(
      { __typename?: 'BadgeObjectType' }
      & Pick<BadgeObjectType, 'id' | 'name' | 'description'>
    )>>>, createdCourses: Array<(
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'score' | 'commentCount' | 'resourceCount'>
      & { user?: Maybe<(
        { __typename?: 'UserObjectType' }
        & Pick<UserObjectType, 'id' | 'username'>
      )> }
    )>, createdResources: Array<(
      { __typename?: 'ResourceObjectType' }
      & Pick<ResourceObjectType, 'id' | 'title' | 'score' | 'date'>
    )> }
  )>, resourceTypes?: Maybe<Array<Maybe<(
    { __typename?: 'ResourceTypeObjectType' }
    & Pick<ResourceTypeObjectType, 'id' | 'name'>
  )>>> }
);

export type SearchCoursesQueryVariables = Exact<{
  courseName?: Maybe<Scalars['String']>;
  courseCode?: Maybe<Scalars['String']>;
  school?: Maybe<Scalars['ID']>;
  subject?: Maybe<Scalars['ID']>;
  schoolType?: Maybe<Scalars['ID']>;
  country?: Maybe<Scalars['ID']>;
  city?: Maybe<Scalars['ID']>;
  ordering?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
}>;


export type SearchCoursesQuery = (
  { __typename?: 'Query' }
  & { searchCourses?: Maybe<(
    { __typename?: 'PaginatedCourseObjectType' }
    & Pick<PaginatedCourseObjectType, 'page' | 'pages' | 'hasPrev' | 'hasNext' | 'count'>
    & { objects?: Maybe<Array<Maybe<(
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'score' | 'commentCount' | 'resourceCount'>
      & { user?: Maybe<(
        { __typename?: 'UserObjectType' }
        & Pick<UserObjectType, 'id' | 'username'>
      )> }
    )>>> }
  )>, school?: Maybe<(
    { __typename?: 'SchoolObjectType' }
    & Pick<SchoolObjectType, 'id' | 'name'>
  )>, subject?: Maybe<(
    { __typename?: 'SubjectObjectType' }
    & Pick<SubjectObjectType, 'id' | 'name'>
  )>, schoolType?: Maybe<(
    { __typename?: 'SchoolTypeObjectType' }
    & Pick<SchoolTypeObjectType, 'id' | 'name'>
  )>, country?: Maybe<(
    { __typename?: 'CountryObjectType' }
    & Pick<CountryObjectType, 'id' | 'name'>
  )>, city?: Maybe<(
    { __typename?: 'CityObjectType' }
    & Pick<CityObjectType, 'id' | 'name'>
  )> }
);

export type CourseQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type CourseQuery = (
  { __typename?: 'Query' }
  & { course?: Maybe<(
    { __typename?: 'CourseObjectType' }
    & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'modified' | 'created' | 'score' | 'starred'>
    & { vote?: Maybe<(
      { __typename?: 'VoteObjectType' }
      & Pick<VoteObjectType, 'id' | 'status'>
    )>, subjects: Array<(
      { __typename?: 'SubjectObjectType' }
      & Pick<SubjectObjectType, 'id' | 'name'>
    )>, school: (
      { __typename?: 'SchoolObjectType' }
      & Pick<SchoolObjectType, 'id' | 'name'>
    ), user?: Maybe<(
      { __typename?: 'UserObjectType' }
      & Pick<UserObjectType, 'id' | 'username'>
    )>, resources: Array<(
      { __typename?: 'ResourceObjectType' }
      & Pick<ResourceObjectType, 'id' | 'title' | 'score' | 'date'>
      & { resourceType?: Maybe<(
        { __typename?: 'ResourceTypeObjectType' }
        & Pick<ResourceTypeObjectType, 'id' | 'name'>
      )> }
    )>, comments: Array<(
      { __typename?: 'CommentObjectType' }
      & Pick<CommentObjectType, 'id' | 'text' | 'attachment' | 'modified' | 'created' | 'score'>
      & { user?: Maybe<(
        { __typename?: 'UserObjectType' }
        & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
      )>, replyComments: Array<(
        { __typename?: 'CommentObjectType' }
        & Pick<CommentObjectType, 'id' | 'text' | 'attachment' | 'modified' | 'created' | 'score'>
        & { user?: Maybe<(
          { __typename?: 'UserObjectType' }
          & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
        )>, vote?: Maybe<(
          { __typename?: 'VoteObjectType' }
          & Pick<VoteObjectType, 'id' | 'status'>
        )> }
      )>, vote?: Maybe<(
        { __typename?: 'VoteObjectType' }
        & Pick<VoteObjectType, 'id' | 'status'>
      )> }
    )> }
  )>, resourceTypes?: Maybe<Array<Maybe<(
    { __typename?: 'ResourceTypeObjectType' }
    & Pick<ResourceTypeObjectType, 'id' | 'name'>
  )>>> }
);

export type ResourceQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type ResourceQuery = (
  { __typename?: 'Query' }
  & { resource?: Maybe<(
    { __typename?: 'ResourceObjectType' }
    & Pick<ResourceObjectType, 'id' | 'title' | 'file' | 'date' | 'modified' | 'created' | 'score' | 'starred'>
    & { resourceType?: Maybe<(
      { __typename?: 'ResourceTypeObjectType' }
      & Pick<ResourceTypeObjectType, 'id' | 'name'>
    )>, school?: Maybe<(
      { __typename?: 'SchoolObjectType' }
      & Pick<SchoolObjectType, 'id' | 'name'>
    )>, course: (
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id' | 'name'>
    ), user?: Maybe<(
      { __typename?: 'UserObjectType' }
      & Pick<UserObjectType, 'id' | 'username'>
    )>, vote?: Maybe<(
      { __typename?: 'VoteObjectType' }
      & Pick<VoteObjectType, 'id' | 'status'>
    )>, comments: Array<(
      { __typename?: 'CommentObjectType' }
      & Pick<CommentObjectType, 'id' | 'text' | 'attachment' | 'modified' | 'created' | 'score'>
      & { user?: Maybe<(
        { __typename?: 'UserObjectType' }
        & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
      )>, vote?: Maybe<(
        { __typename?: 'VoteObjectType' }
        & Pick<VoteObjectType, 'id' | 'status'>
      )>, replyComments: Array<(
        { __typename?: 'CommentObjectType' }
        & Pick<CommentObjectType, 'id' | 'text' | 'attachment' | 'score'>
        & { user?: Maybe<(
          { __typename?: 'UserObjectType' }
          & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
        )>, vote?: Maybe<(
          { __typename?: 'VoteObjectType' }
          & Pick<VoteObjectType, 'id' | 'status'>
        )> }
      )> }
    )> }
  )> }
);

export type SchoolQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type SchoolQuery = (
  { __typename?: 'Query' }
  & { school?: Maybe<(
    { __typename?: 'SchoolObjectType' }
    & Pick<SchoolObjectType, 'id' | 'name'>
    & { city?: Maybe<(
      { __typename?: 'CityObjectType' }
      & Pick<CityObjectType, 'id' | 'name'>
    )>, country?: Maybe<(
      { __typename?: 'CountryObjectType' }
      & Pick<CountryObjectType, 'id' | 'name'>
    )>, schoolType?: Maybe<(
      { __typename?: 'SchoolTypeObjectType' }
      & Pick<SchoolTypeObjectType, 'id' | 'name'>
    )>, subjects?: Maybe<Array<Maybe<(
      { __typename?: 'SubjectObjectType' }
      & Pick<SubjectObjectType, 'id' | 'name'>
    )>>>, courses: Array<(
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'score' | 'commentCount' | 'resourceCount'>
      & { user?: Maybe<(
        { __typename?: 'UserObjectType' }
        & Pick<UserObjectType, 'id' | 'username'>
      )> }
    )> }
  )> }
);

export type CreateResourceAutocompleteDataQueryVariables = Exact<{
  school?: Maybe<Scalars['ID']>;
  course?: Maybe<Scalars['ID']>;
}>;


export type CreateResourceAutocompleteDataQuery = (
  { __typename?: 'Query' }
  & { school?: Maybe<(
    { __typename?: 'SchoolObjectType' }
    & Pick<SchoolObjectType, 'id' | 'name'>
  )>, course?: Maybe<(
    { __typename?: 'CourseObjectType' }
    & Pick<CourseObjectType, 'id' | 'name'>
  )> }
);

export type CreateCourseAutocompleteDataQueryVariables = Exact<{
  school?: Maybe<Scalars['ID']>;
}>;


export type CreateCourseAutocompleteDataQuery = (
  { __typename?: 'Query' }
  & { school?: Maybe<(
    { __typename?: 'SchoolObjectType' }
    & Pick<SchoolObjectType, 'id' | 'name'>
  )> }
);

export type AutocompleteSchoolsQueryVariables = Exact<{
  name?: Maybe<Scalars['String']>;
}>;


export type AutocompleteSchoolsQuery = (
  { __typename?: 'Query' }
  & { autocompleteSchools?: Maybe<Array<Maybe<(
    { __typename?: 'SchoolObjectType' }
    & Pick<SchoolObjectType, 'id' | 'name'>
  )>>> }
);

export type AutocompleteSchoolTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type AutocompleteSchoolTypesQuery = (
  { __typename?: 'Query' }
  & { autocompleteSchoolTypes?: Maybe<Array<Maybe<(
    { __typename?: 'SchoolTypeObjectType' }
    & Pick<SchoolTypeObjectType, 'id' | 'name'>
  )>>> }
);

export type AutocompleteCoursesQueryVariables = Exact<{
  school?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
}>;


export type AutocompleteCoursesQuery = (
  { __typename?: 'Query' }
  & { autocompleteCourses?: Maybe<Array<Maybe<(
    { __typename?: 'CourseObjectType' }
    & Pick<CourseObjectType, 'id' | 'name'>
  )>>> }
);

export type AutocompleteCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AutocompleteCountriesQuery = (
  { __typename?: 'Query' }
  & { autocompleteCountries?: Maybe<Array<Maybe<(
    { __typename?: 'CountryObjectType' }
    & Pick<CountryObjectType, 'id' | 'name'>
  )>>> }
);

export type AutocompleteCitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type AutocompleteCitiesQuery = (
  { __typename?: 'Query' }
  & { autocompleteCities?: Maybe<Array<Maybe<(
    { __typename?: 'CityObjectType' }
    & Pick<CityObjectType, 'id' | 'name'>
  )>>> }
);

export type AutocompleteResourceTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type AutocompleteResourceTypesQuery = (
  { __typename?: 'Query' }
  & { autocompleteResourceTypes?: Maybe<Array<Maybe<(
    { __typename?: 'ResourceTypeObjectType' }
    & Pick<ResourceTypeObjectType, 'id' | 'name'>
  )>>> }
);

export type AutocompleteSubjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type AutocompleteSubjectsQuery = (
  { __typename?: 'Query' }
  & { autocompleteSubjects?: Maybe<Array<Maybe<(
    { __typename?: 'SubjectObjectType' }
    & Pick<SubjectObjectType, 'id' | 'name'>
  )>>> }
);


export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
  register(input: {username: $username, email: $email, password: $password}) {
    errors {
      field
      messages
    }
  }
  login(input: {usernameOrEmail: $username, password: $password}) {
    user {
      username
      email
    }
    errors {
      field
      messages
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(input: {usernameOrEmail: $usernameOrEmail, password: $password}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const BackendLogoutDocument = gql`
    mutation BackendLogout {
  logout {
    deleted
  }
}
    `;
export type BackendLogoutMutationFn = Apollo.MutationFunction<BackendLogoutMutation, BackendLogoutMutationVariables>;

/**
 * __useBackendLogoutMutation__
 *
 * To run a mutation, you first call `useBackendLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBackendLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [backendLogoutMutation, { data, loading, error }] = useBackendLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useBackendLogoutMutation(baseOptions?: Apollo.MutationHookOptions<BackendLogoutMutation, BackendLogoutMutationVariables>) {
        return Apollo.useMutation<BackendLogoutMutation, BackendLogoutMutationVariables>(BackendLogoutDocument, baseOptions);
      }
export type BackendLogoutMutationHookResult = ReturnType<typeof useBackendLogoutMutation>;
export type BackendLogoutMutationResult = Apollo.MutationResult<BackendLogoutMutation>;
export type BackendLogoutMutationOptions = Apollo.BaseMutationOptions<BackendLogoutMutation, BackendLogoutMutationVariables>;
export const ResendVerificationEmailDocument = gql`
    mutation ResendVerificationEmail($email: String!) {
  resendVerificationEmail(input: {email: $email}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type ResendVerificationEmailMutationFn = Apollo.MutationFunction<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;

/**
 * __useResendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useResendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendVerificationEmailMutation, { data, loading, error }] = useResendVerificationEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useResendVerificationEmailMutation(baseOptions?: Apollo.MutationHookOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>) {
        return Apollo.useMutation<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>(ResendVerificationEmailDocument, baseOptions);
      }
export type ResendVerificationEmailMutationHookResult = ReturnType<typeof useResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationResult = Apollo.MutationResult<ResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationOptions = Apollo.BaseMutationOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;
export const VerifyAccountDocument = gql`
    mutation VerifyAccount($token: String) {
  verifyAccount(input: {token: $token}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type VerifyAccountMutationFn = Apollo.MutationFunction<VerifyAccountMutation, VerifyAccountMutationVariables>;

/**
 * __useVerifyAccountMutation__
 *
 * To run a mutation, you first call `useVerifyAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyAccountMutation, { data, loading, error }] = useVerifyAccountMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerifyAccountMutation(baseOptions?: Apollo.MutationHookOptions<VerifyAccountMutation, VerifyAccountMutationVariables>) {
        return Apollo.useMutation<VerifyAccountMutation, VerifyAccountMutationVariables>(VerifyAccountDocument, baseOptions);
      }
export type VerifyAccountMutationHookResult = ReturnType<typeof useVerifyAccountMutation>;
export type VerifyAccountMutationResult = Apollo.MutationResult<VerifyAccountMutation>;
export type VerifyAccountMutationOptions = Apollo.BaseMutationOptions<VerifyAccountMutation, VerifyAccountMutationVariables>;
export const SendPasswordResetEmailDocument = gql`
    mutation SendPasswordResetEmail($email: String!) {
  sendPasswordResetEmail(input: {email: $email}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type SendPasswordResetEmailMutationFn = Apollo.MutationFunction<SendPasswordResetEmailMutation, SendPasswordResetEmailMutationVariables>;

/**
 * __useSendPasswordResetEmailMutation__
 *
 * To run a mutation, you first call `useSendPasswordResetEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendPasswordResetEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendPasswordResetEmailMutation, { data, loading, error }] = useSendPasswordResetEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useSendPasswordResetEmailMutation(baseOptions?: Apollo.MutationHookOptions<SendPasswordResetEmailMutation, SendPasswordResetEmailMutationVariables>) {
        return Apollo.useMutation<SendPasswordResetEmailMutation, SendPasswordResetEmailMutationVariables>(SendPasswordResetEmailDocument, baseOptions);
      }
export type SendPasswordResetEmailMutationHookResult = ReturnType<typeof useSendPasswordResetEmailMutation>;
export type SendPasswordResetEmailMutationResult = Apollo.MutationResult<SendPasswordResetEmailMutation>;
export type SendPasswordResetEmailMutationOptions = Apollo.BaseMutationOptions<SendPasswordResetEmailMutation, SendPasswordResetEmailMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String, $newPassword: String!) {
  resetPassword(input: {token: $token, newPassword: $newPassword}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, baseOptions);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($username: String!, $email: String!, $title: String, $bio: String, $avatar: String, $school: ID, $subject: ID) {
  updateUser(input: {username: $username, email: $email, title: $title, bio: $bio, avatar: $avatar, school: $school, subject: $subject}) {
    message
    user {
      id
      username
      email
      title
      bio
      avatar
      score
      created
    }
    errors {
      field
      messages
    }
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      title: // value for 'title'
 *      bio: // value for 'bio'
 *      avatar: // value for 'avatar'
 *      school: // value for 'school'
 *      subject: // value for 'subject'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, baseOptions);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
  changePassword(input: {oldPassword: $oldPassword, newPassword: $newPassword}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      oldPassword: // value for 'oldPassword'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, baseOptions);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($password: String!) {
  deleteUser(input: {password: $password}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      password: // value for 'password'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, baseOptions);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const PerformStarDocument = gql`
    mutation PerformStar($course: ID, $resource: ID) {
  performStar(input: {course: $course, resource: $resource}) {
    starred
    errors {
      field
      messages
    }
  }
}
    `;
export type PerformStarMutationFn = Apollo.MutationFunction<PerformStarMutation, PerformStarMutationVariables>;

/**
 * __usePerformStarMutation__
 *
 * To run a mutation, you first call `usePerformStarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePerformStarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [performStarMutation, { data, loading, error }] = usePerformStarMutation({
 *   variables: {
 *      course: // value for 'course'
 *      resource: // value for 'resource'
 *   },
 * });
 */
export function usePerformStarMutation(baseOptions?: Apollo.MutationHookOptions<PerformStarMutation, PerformStarMutationVariables>) {
        return Apollo.useMutation<PerformStarMutation, PerformStarMutationVariables>(PerformStarDocument, baseOptions);
      }
export type PerformStarMutationHookResult = ReturnType<typeof usePerformStarMutation>;
export type PerformStarMutationResult = Apollo.MutationResult<PerformStarMutation>;
export type PerformStarMutationOptions = Apollo.BaseMutationOptions<PerformStarMutation, PerformStarMutationVariables>;
export const PerformVoteDocument = gql`
    mutation PerformVote($status: Int!, $comment: ID, $course: ID, $resource: ID) {
  performVote(input: {status: $status, comment: $comment, course: $course, resource: $resource}) {
    vote {
      id
      status
    }
    targetScore
    errors {
      field
      messages
    }
  }
}
    `;
export type PerformVoteMutationFn = Apollo.MutationFunction<PerformVoteMutation, PerformVoteMutationVariables>;

/**
 * __usePerformVoteMutation__
 *
 * To run a mutation, you first call `usePerformVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePerformVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [performVoteMutation, { data, loading, error }] = usePerformVoteMutation({
 *   variables: {
 *      status: // value for 'status'
 *      comment: // value for 'comment'
 *      course: // value for 'course'
 *      resource: // value for 'resource'
 *   },
 * });
 */
export function usePerformVoteMutation(baseOptions?: Apollo.MutationHookOptions<PerformVoteMutation, PerformVoteMutationVariables>) {
        return Apollo.useMutation<PerformVoteMutation, PerformVoteMutationVariables>(PerformVoteDocument, baseOptions);
      }
export type PerformVoteMutationHookResult = ReturnType<typeof usePerformVoteMutation>;
export type PerformVoteMutationResult = Apollo.MutationResult<PerformVoteMutation>;
export type PerformVoteMutationOptions = Apollo.BaseMutationOptions<PerformVoteMutation, PerformVoteMutationVariables>;
export const CreateCommentDocument = gql`
    mutation CreateComment($text: String!, $attachment: String, $course: ID, $resource: ID, $comment: ID) {
  createComment(input: {text: $text, attachment: $attachment, course: $course, resource: $resource, comment: $comment}) {
    message
    comment {
      id
      user {
        id
        username
        avatarThumbnail
      }
      text
      attachment
      modified
      created
      replyComments {
        id
        user {
          id
          username
          avatarThumbnail
        }
        text
        attachment
        modified
        created
        score
        vote {
          id
          status
        }
      }
      score
      vote {
        id
        status
      }
    }
    errors {
      field
      messages
    }
  }
}
    `;
export type CreateCommentMutationFn = Apollo.MutationFunction<CreateCommentMutation, CreateCommentMutationVariables>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      text: // value for 'text'
 *      attachment: // value for 'attachment'
 *      course: // value for 'course'
 *      resource: // value for 'resource'
 *      comment: // value for 'comment'
 *   },
 * });
 */
export function useCreateCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
        return Apollo.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, baseOptions);
      }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
export const DeleteCommentDocument = gql`
    mutation DeleteComment($id: ID) {
  deleteComment(input: {id: $id}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type DeleteCommentMutationFn = Apollo.MutationFunction<DeleteCommentMutation, DeleteCommentMutationVariables>;

/**
 * __useDeleteCommentMutation__
 *
 * To run a mutation, you first call `useDeleteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCommentMutation, { data, loading, error }] = useDeleteCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCommentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCommentMutation, DeleteCommentMutationVariables>) {
        return Apollo.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument, baseOptions);
      }
export type DeleteCommentMutationHookResult = ReturnType<typeof useDeleteCommentMutation>;
export type DeleteCommentMutationResult = Apollo.MutationResult<DeleteCommentMutation>;
export type DeleteCommentMutationOptions = Apollo.BaseMutationOptions<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const CreateContactMessageDocument = gql`
    mutation CreateContactMessage($subject: String!, $name: String, $email: String!, $message: String!) {
  createContactMessage(input: {subject: $subject, name: $name, email: $email, message: $message}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type CreateContactMessageMutationFn = Apollo.MutationFunction<CreateContactMessageMutation, CreateContactMessageMutationVariables>;

/**
 * __useCreateContactMessageMutation__
 *
 * To run a mutation, you first call `useCreateContactMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateContactMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createContactMessageMutation, { data, loading, error }] = useCreateContactMessageMutation({
 *   variables: {
 *      subject: // value for 'subject'
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      message: // value for 'message'
 *   },
 * });
 */
export function useCreateContactMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateContactMessageMutation, CreateContactMessageMutationVariables>) {
        return Apollo.useMutation<CreateContactMessageMutation, CreateContactMessageMutationVariables>(CreateContactMessageDocument, baseOptions);
      }
export type CreateContactMessageMutationHookResult = ReturnType<typeof useCreateContactMessageMutation>;
export type CreateContactMessageMutationResult = Apollo.MutationResult<CreateContactMessageMutation>;
export type CreateContactMessageMutationOptions = Apollo.BaseMutationOptions<CreateContactMessageMutation, CreateContactMessageMutationVariables>;
export const CreateCourseDocument = gql`
    mutation CreateCourse($courseName: String!, $courseCode: String, $subjects: [ID], $school: ID!) {
  createCourse(input: {name: $courseName, code: $courseCode, subjects: $subjects, school: $school}) {
    message
    course {
      id
    }
    errors {
      field
      messages
    }
  }
}
    `;
export type CreateCourseMutationFn = Apollo.MutationFunction<CreateCourseMutation, CreateCourseMutationVariables>;

/**
 * __useCreateCourseMutation__
 *
 * To run a mutation, you first call `useCreateCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCourseMutation, { data, loading, error }] = useCreateCourseMutation({
 *   variables: {
 *      courseName: // value for 'courseName'
 *      courseCode: // value for 'courseCode'
 *      subjects: // value for 'subjects'
 *      school: // value for 'school'
 *   },
 * });
 */
export function useCreateCourseMutation(baseOptions?: Apollo.MutationHookOptions<CreateCourseMutation, CreateCourseMutationVariables>) {
        return Apollo.useMutation<CreateCourseMutation, CreateCourseMutationVariables>(CreateCourseDocument, baseOptions);
      }
export type CreateCourseMutationHookResult = ReturnType<typeof useCreateCourseMutation>;
export type CreateCourseMutationResult = Apollo.MutationResult<CreateCourseMutation>;
export type CreateCourseMutationOptions = Apollo.BaseMutationOptions<CreateCourseMutation, CreateCourseMutationVariables>;
export const DeleteCourseDocument = gql`
    mutation DeleteCourse($id: ID) {
  deleteCourse(input: {id: $id}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type DeleteCourseMutationFn = Apollo.MutationFunction<DeleteCourseMutation, DeleteCourseMutationVariables>;

/**
 * __useDeleteCourseMutation__
 *
 * To run a mutation, you first call `useDeleteCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCourseMutation, { data, loading, error }] = useDeleteCourseMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCourseMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCourseMutation, DeleteCourseMutationVariables>) {
        return Apollo.useMutation<DeleteCourseMutation, DeleteCourseMutationVariables>(DeleteCourseDocument, baseOptions);
      }
export type DeleteCourseMutationHookResult = ReturnType<typeof useDeleteCourseMutation>;
export type DeleteCourseMutationResult = Apollo.MutationResult<DeleteCourseMutation>;
export type DeleteCourseMutationOptions = Apollo.BaseMutationOptions<DeleteCourseMutation, DeleteCourseMutationVariables>;
export const CreateResourceDocument = gql`
    mutation CreateResource($resourceTitle: String!, $resourceType: ID!, $course: ID!, $file: String!) {
  createResource(input: {title: $resourceTitle, resourceType: $resourceType, course: $course, file: $file}) {
    message
    resource {
      id
    }
    errors {
      field
      messages
    }
  }
}
    `;
export type CreateResourceMutationFn = Apollo.MutationFunction<CreateResourceMutation, CreateResourceMutationVariables>;

/**
 * __useCreateResourceMutation__
 *
 * To run a mutation, you first call `useCreateResourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateResourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createResourceMutation, { data, loading, error }] = useCreateResourceMutation({
 *   variables: {
 *      resourceTitle: // value for 'resourceTitle'
 *      resourceType: // value for 'resourceType'
 *      course: // value for 'course'
 *      file: // value for 'file'
 *   },
 * });
 */
export function useCreateResourceMutation(baseOptions?: Apollo.MutationHookOptions<CreateResourceMutation, CreateResourceMutationVariables>) {
        return Apollo.useMutation<CreateResourceMutation, CreateResourceMutationVariables>(CreateResourceDocument, baseOptions);
      }
export type CreateResourceMutationHookResult = ReturnType<typeof useCreateResourceMutation>;
export type CreateResourceMutationResult = Apollo.MutationResult<CreateResourceMutation>;
export type CreateResourceMutationOptions = Apollo.BaseMutationOptions<CreateResourceMutation, CreateResourceMutationVariables>;
export const DeleteResourceDocument = gql`
    mutation DeleteResource($id: ID) {
  deleteResource(input: {id: $id}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type DeleteResourceMutationFn = Apollo.MutationFunction<DeleteResourceMutation, DeleteResourceMutationVariables>;

/**
 * __useDeleteResourceMutation__
 *
 * To run a mutation, you first call `useDeleteResourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteResourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteResourceMutation, { data, loading, error }] = useDeleteResourceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteResourceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteResourceMutation, DeleteResourceMutationVariables>) {
        return Apollo.useMutation<DeleteResourceMutation, DeleteResourceMutationVariables>(DeleteResourceDocument, baseOptions);
      }
export type DeleteResourceMutationHookResult = ReturnType<typeof useDeleteResourceMutation>;
export type DeleteResourceMutationResult = Apollo.MutationResult<DeleteResourceMutation>;
export type DeleteResourceMutationOptions = Apollo.BaseMutationOptions<DeleteResourceMutation, DeleteResourceMutationVariables>;
export const MarkActivityReadDocument = gql`
    mutation MarkActivityRead($id: ID, $read: Boolean) {
  markActivityRead(input: {id: $id, read: $read}) {
    errors {
      field
      messages
    }
    activity {
      id
      description
      read
      targetUser {
        id
        username
        avatarThumbnail
      }
      course {
        id
      }
      resource {
        id
      }
      comment {
        id
      }
    }
  }
}
    `;
export type MarkActivityReadMutationFn = Apollo.MutationFunction<MarkActivityReadMutation, MarkActivityReadMutationVariables>;

/**
 * __useMarkActivityReadMutation__
 *
 * To run a mutation, you first call `useMarkActivityReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkActivityReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markActivityReadMutation, { data, loading, error }] = useMarkActivityReadMutation({
 *   variables: {
 *      id: // value for 'id'
 *      read: // value for 'read'
 *   },
 * });
 */
export function useMarkActivityReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkActivityReadMutation, MarkActivityReadMutationVariables>) {
        return Apollo.useMutation<MarkActivityReadMutation, MarkActivityReadMutationVariables>(MarkActivityReadDocument, baseOptions);
      }
export type MarkActivityReadMutationHookResult = ReturnType<typeof useMarkActivityReadMutation>;
export type MarkActivityReadMutationResult = Apollo.MutationResult<MarkActivityReadMutation>;
export type MarkActivityReadMutationOptions = Apollo.BaseMutationOptions<MarkActivityReadMutation, MarkActivityReadMutationVariables>;
export const MarkAllActivitiesAsReadDocument = gql`
    mutation MarkAllActivitiesAsRead {
  markAllActivitiesRead {
    errors {
      field
      messages
    }
    activities {
      id
      description
      read
      targetUser {
        id
        username
        avatarThumbnail
      }
      course {
        id
      }
      resource {
        id
      }
      comment {
        id
      }
    }
  }
}
    `;
export type MarkAllActivitiesAsReadMutationFn = Apollo.MutationFunction<MarkAllActivitiesAsReadMutation, MarkAllActivitiesAsReadMutationVariables>;

/**
 * __useMarkAllActivitiesAsReadMutation__
 *
 * To run a mutation, you first call `useMarkAllActivitiesAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkAllActivitiesAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markAllActivitiesAsReadMutation, { data, loading, error }] = useMarkAllActivitiesAsReadMutation({
 *   variables: {
 *   },
 * });
 */
export function useMarkAllActivitiesAsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkAllActivitiesAsReadMutation, MarkAllActivitiesAsReadMutationVariables>) {
        return Apollo.useMutation<MarkAllActivitiesAsReadMutation, MarkAllActivitiesAsReadMutationVariables>(MarkAllActivitiesAsReadDocument, baseOptions);
      }
export type MarkAllActivitiesAsReadMutationHookResult = ReturnType<typeof useMarkAllActivitiesAsReadMutation>;
export type MarkAllActivitiesAsReadMutationResult = Apollo.MutationResult<MarkAllActivitiesAsReadMutation>;
export type MarkAllActivitiesAsReadMutationOptions = Apollo.BaseMutationOptions<MarkAllActivitiesAsReadMutation, MarkAllActivitiesAsReadMutationVariables>;
export const UserMeDocument = gql`
    query UserMe {
  userMe {
    id
    username
    email
    title
    bio
    avatar
    score
    created
    verified
    school {
      id
      name
    }
    subject {
      id
      name
    }
    activity {
      id
      description
      read
      targetUser {
        id
        username
        avatarThumbnail
      }
      course {
        id
      }
      resource {
        id
      }
      comment {
        id
      }
    }
  }
}
    `;

/**
 * __useUserMeQuery__
 *
 * To run a query within a React component, call `useUserMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserMeQuery(baseOptions?: Apollo.QueryHookOptions<UserMeQuery, UserMeQueryVariables>) {
        return Apollo.useQuery<UserMeQuery, UserMeQueryVariables>(UserMeDocument, baseOptions);
      }
export function useUserMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserMeQuery, UserMeQueryVariables>) {
          return Apollo.useLazyQuery<UserMeQuery, UserMeQueryVariables>(UserMeDocument, baseOptions);
        }
export type UserMeQueryHookResult = ReturnType<typeof useUserMeQuery>;
export type UserMeLazyQueryHookResult = ReturnType<typeof useUserMeLazyQuery>;
export type UserMeQueryResult = Apollo.QueryResult<UserMeQuery, UserMeQueryVariables>;
export const StarredDocument = gql`
    query Starred {
  userMe {
    starredCourses {
      id
      name
      code
      score
      commentCount
      resourceCount
      user {
        id
        username
      }
    }
    starredResources {
      id
      title
      score
      date
      resourceType {
        id
      }
    }
  }
  resourceTypes {
    id
    name
  }
}
    `;

/**
 * __useStarredQuery__
 *
 * To run a query within a React component, call `useStarredQuery` and pass it any options that fit your needs.
 * When your component renders, `useStarredQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStarredQuery({
 *   variables: {
 *   },
 * });
 */
export function useStarredQuery(baseOptions?: Apollo.QueryHookOptions<StarredQuery, StarredQueryVariables>) {
        return Apollo.useQuery<StarredQuery, StarredQueryVariables>(StarredDocument, baseOptions);
      }
export function useStarredLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StarredQuery, StarredQueryVariables>) {
          return Apollo.useLazyQuery<StarredQuery, StarredQueryVariables>(StarredDocument, baseOptions);
        }
export type StarredQueryHookResult = ReturnType<typeof useStarredQuery>;
export type StarredLazyQueryHookResult = ReturnType<typeof useStarredLazyQuery>;
export type StarredQueryResult = Apollo.QueryResult<StarredQuery, StarredQueryVariables>;
export const UserDocument = gql`
    query User($id: ID) {
  user(id: $id) {
    id
    username
    title
    bio
    avatar
    score
    created
    verified
    rank
    badges {
      id
      name
      description
    }
    createdCourses {
      id
      name
      code
      score
      commentCount
      resourceCount
      user {
        id
        username
      }
    }
    createdResources {
      id
      title
      score
      date
    }
  }
  resourceTypes {
    id
    name
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const SearchCoursesDocument = gql`
    query SearchCourses($courseName: String, $courseCode: String, $school: ID, $subject: ID, $schoolType: ID, $country: ID, $city: ID, $ordering: String, $page: Int, $pageSize: Int) {
  searchCourses(courseName: $courseName, courseCode: $courseCode, school: $school, subject: $subject, schoolType: $schoolType, country: $country, city: $city, ordering: $ordering, page: $page, pageSize: $pageSize) {
    page
    pages
    hasPrev
    hasNext
    count
    objects {
      id
      name
      code
      score
      commentCount
      resourceCount
      user {
        id
        username
      }
    }
  }
  school(id: $school) {
    id
    name
  }
  subject(id: $subject) {
    id
    name
  }
  schoolType(id: $schoolType) {
    id
    name
  }
  country(id: $country) {
    id
    name
  }
  city(id: $city) {
    id
    name
  }
}
    `;

/**
 * __useSearchCoursesQuery__
 *
 * To run a query within a React component, call `useSearchCoursesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCoursesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCoursesQuery({
 *   variables: {
 *      courseName: // value for 'courseName'
 *      courseCode: // value for 'courseCode'
 *      school: // value for 'school'
 *      subject: // value for 'subject'
 *      schoolType: // value for 'schoolType'
 *      country: // value for 'country'
 *      city: // value for 'city'
 *      ordering: // value for 'ordering'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useSearchCoursesQuery(baseOptions?: Apollo.QueryHookOptions<SearchCoursesQuery, SearchCoursesQueryVariables>) {
        return Apollo.useQuery<SearchCoursesQuery, SearchCoursesQueryVariables>(SearchCoursesDocument, baseOptions);
      }
export function useSearchCoursesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchCoursesQuery, SearchCoursesQueryVariables>) {
          return Apollo.useLazyQuery<SearchCoursesQuery, SearchCoursesQueryVariables>(SearchCoursesDocument, baseOptions);
        }
export type SearchCoursesQueryHookResult = ReturnType<typeof useSearchCoursesQuery>;
export type SearchCoursesLazyQueryHookResult = ReturnType<typeof useSearchCoursesLazyQuery>;
export type SearchCoursesQueryResult = Apollo.QueryResult<SearchCoursesQuery, SearchCoursesQueryVariables>;
export const CourseDocument = gql`
    query Course($id: ID) {
  course(id: $id) {
    id
    name
    code
    modified
    created
    score
    starred
    vote {
      id
      status
    }
    subjects {
      id
      name
    }
    school {
      id
      name
    }
    user {
      id
      username
    }
    resources {
      id
      title
      score
      date
      resourceType {
        id
        name
      }
    }
    comments {
      id
      user {
        id
        username
        avatarThumbnail
      }
      text
      attachment
      modified
      created
      replyComments {
        id
        user {
          id
          username
          avatarThumbnail
        }
        text
        attachment
        modified
        created
        score
        vote {
          id
          status
        }
      }
      score
      vote {
        id
        status
      }
    }
  }
  resourceTypes {
    id
    name
  }
}
    `;

/**
 * __useCourseQuery__
 *
 * To run a query within a React component, call `useCourseQuery` and pass it any options that fit your needs.
 * When your component renders, `useCourseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCourseQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCourseQuery(baseOptions?: Apollo.QueryHookOptions<CourseQuery, CourseQueryVariables>) {
        return Apollo.useQuery<CourseQuery, CourseQueryVariables>(CourseDocument, baseOptions);
      }
export function useCourseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CourseQuery, CourseQueryVariables>) {
          return Apollo.useLazyQuery<CourseQuery, CourseQueryVariables>(CourseDocument, baseOptions);
        }
export type CourseQueryHookResult = ReturnType<typeof useCourseQuery>;
export type CourseLazyQueryHookResult = ReturnType<typeof useCourseLazyQuery>;
export type CourseQueryResult = Apollo.QueryResult<CourseQuery, CourseQueryVariables>;
export const ResourceDocument = gql`
    query Resource($id: ID) {
  resource(id: $id) {
    id
    title
    file
    date
    modified
    created
    score
    starred
    resourceType {
      id
      name
    }
    school {
      id
      name
    }
    course {
      id
      name
    }
    user {
      id
      username
    }
    vote {
      id
      status
    }
    comments {
      id
      text
      attachment
      modified
      created
      modified
      created
      score
      user {
        id
        username
        avatarThumbnail
      }
      vote {
        id
        status
      }
      replyComments {
        id
        user {
          id
          username
          avatarThumbnail
        }
        text
        attachment
        score
        vote {
          id
          status
        }
      }
    }
  }
}
    `;

/**
 * __useResourceQuery__
 *
 * To run a query within a React component, call `useResourceQuery` and pass it any options that fit your needs.
 * When your component renders, `useResourceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResourceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useResourceQuery(baseOptions?: Apollo.QueryHookOptions<ResourceQuery, ResourceQueryVariables>) {
        return Apollo.useQuery<ResourceQuery, ResourceQueryVariables>(ResourceDocument, baseOptions);
      }
export function useResourceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResourceQuery, ResourceQueryVariables>) {
          return Apollo.useLazyQuery<ResourceQuery, ResourceQueryVariables>(ResourceDocument, baseOptions);
        }
export type ResourceQueryHookResult = ReturnType<typeof useResourceQuery>;
export type ResourceLazyQueryHookResult = ReturnType<typeof useResourceLazyQuery>;
export type ResourceQueryResult = Apollo.QueryResult<ResourceQuery, ResourceQueryVariables>;
export const SchoolDocument = gql`
    query School($id: ID) {
  school(id: $id) {
    id
    name
    city {
      id
      name
    }
    country {
      id
      name
    }
    schoolType {
      id
      name
    }
    subjects {
      id
      name
    }
    courses {
      id
      name
      code
      score
      commentCount
      resourceCount
      user {
        id
        username
      }
    }
  }
}
    `;

/**
 * __useSchoolQuery__
 *
 * To run a query within a React component, call `useSchoolQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSchoolQuery(baseOptions?: Apollo.QueryHookOptions<SchoolQuery, SchoolQueryVariables>) {
        return Apollo.useQuery<SchoolQuery, SchoolQueryVariables>(SchoolDocument, baseOptions);
      }
export function useSchoolLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolQuery, SchoolQueryVariables>) {
          return Apollo.useLazyQuery<SchoolQuery, SchoolQueryVariables>(SchoolDocument, baseOptions);
        }
export type SchoolQueryHookResult = ReturnType<typeof useSchoolQuery>;
export type SchoolLazyQueryHookResult = ReturnType<typeof useSchoolLazyQuery>;
export type SchoolQueryResult = Apollo.QueryResult<SchoolQuery, SchoolQueryVariables>;
export const CreateResourceAutocompleteDataDocument = gql`
    query CreateResourceAutocompleteData($school: ID, $course: ID) {
  school(id: $school) {
    id
    name
  }
  course(id: $course) {
    id
    name
  }
}
    `;

/**
 * __useCreateResourceAutocompleteDataQuery__
 *
 * To run a query within a React component, call `useCreateResourceAutocompleteDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useCreateResourceAutocompleteDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreateResourceAutocompleteDataQuery({
 *   variables: {
 *      school: // value for 'school'
 *      course: // value for 'course'
 *   },
 * });
 */
export function useCreateResourceAutocompleteDataQuery(baseOptions?: Apollo.QueryHookOptions<CreateResourceAutocompleteDataQuery, CreateResourceAutocompleteDataQueryVariables>) {
        return Apollo.useQuery<CreateResourceAutocompleteDataQuery, CreateResourceAutocompleteDataQueryVariables>(CreateResourceAutocompleteDataDocument, baseOptions);
      }
export function useCreateResourceAutocompleteDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CreateResourceAutocompleteDataQuery, CreateResourceAutocompleteDataQueryVariables>) {
          return Apollo.useLazyQuery<CreateResourceAutocompleteDataQuery, CreateResourceAutocompleteDataQueryVariables>(CreateResourceAutocompleteDataDocument, baseOptions);
        }
export type CreateResourceAutocompleteDataQueryHookResult = ReturnType<typeof useCreateResourceAutocompleteDataQuery>;
export type CreateResourceAutocompleteDataLazyQueryHookResult = ReturnType<typeof useCreateResourceAutocompleteDataLazyQuery>;
export type CreateResourceAutocompleteDataQueryResult = Apollo.QueryResult<CreateResourceAutocompleteDataQuery, CreateResourceAutocompleteDataQueryVariables>;
export const CreateCourseAutocompleteDataDocument = gql`
    query CreateCourseAutocompleteData($school: ID) {
  school(id: $school) {
    id
    name
  }
}
    `;

/**
 * __useCreateCourseAutocompleteDataQuery__
 *
 * To run a query within a React component, call `useCreateCourseAutocompleteDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useCreateCourseAutocompleteDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreateCourseAutocompleteDataQuery({
 *   variables: {
 *      school: // value for 'school'
 *   },
 * });
 */
export function useCreateCourseAutocompleteDataQuery(baseOptions?: Apollo.QueryHookOptions<CreateCourseAutocompleteDataQuery, CreateCourseAutocompleteDataQueryVariables>) {
        return Apollo.useQuery<CreateCourseAutocompleteDataQuery, CreateCourseAutocompleteDataQueryVariables>(CreateCourseAutocompleteDataDocument, baseOptions);
      }
export function useCreateCourseAutocompleteDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CreateCourseAutocompleteDataQuery, CreateCourseAutocompleteDataQueryVariables>) {
          return Apollo.useLazyQuery<CreateCourseAutocompleteDataQuery, CreateCourseAutocompleteDataQueryVariables>(CreateCourseAutocompleteDataDocument, baseOptions);
        }
export type CreateCourseAutocompleteDataQueryHookResult = ReturnType<typeof useCreateCourseAutocompleteDataQuery>;
export type CreateCourseAutocompleteDataLazyQueryHookResult = ReturnType<typeof useCreateCourseAutocompleteDataLazyQuery>;
export type CreateCourseAutocompleteDataQueryResult = Apollo.QueryResult<CreateCourseAutocompleteDataQuery, CreateCourseAutocompleteDataQueryVariables>;
export const AutocompleteSchoolsDocument = gql`
    query AutocompleteSchools($name: String) {
  autocompleteSchools(name: $name) {
    id
    name
  }
}
    `;

/**
 * __useAutocompleteSchoolsQuery__
 *
 * To run a query within a React component, call `useAutocompleteSchoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAutocompleteSchoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAutocompleteSchoolsQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useAutocompleteSchoolsQuery(baseOptions?: Apollo.QueryHookOptions<AutocompleteSchoolsQuery, AutocompleteSchoolsQueryVariables>) {
        return Apollo.useQuery<AutocompleteSchoolsQuery, AutocompleteSchoolsQueryVariables>(AutocompleteSchoolsDocument, baseOptions);
      }
export function useAutocompleteSchoolsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AutocompleteSchoolsQuery, AutocompleteSchoolsQueryVariables>) {
          return Apollo.useLazyQuery<AutocompleteSchoolsQuery, AutocompleteSchoolsQueryVariables>(AutocompleteSchoolsDocument, baseOptions);
        }
export type AutocompleteSchoolsQueryHookResult = ReturnType<typeof useAutocompleteSchoolsQuery>;
export type AutocompleteSchoolsLazyQueryHookResult = ReturnType<typeof useAutocompleteSchoolsLazyQuery>;
export type AutocompleteSchoolsQueryResult = Apollo.QueryResult<AutocompleteSchoolsQuery, AutocompleteSchoolsQueryVariables>;
export const AutocompleteSchoolTypesDocument = gql`
    query AutocompleteSchoolTypes {
  autocompleteSchoolTypes {
    id
    name
  }
}
    `;

/**
 * __useAutocompleteSchoolTypesQuery__
 *
 * To run a query within a React component, call `useAutocompleteSchoolTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAutocompleteSchoolTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAutocompleteSchoolTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAutocompleteSchoolTypesQuery(baseOptions?: Apollo.QueryHookOptions<AutocompleteSchoolTypesQuery, AutocompleteSchoolTypesQueryVariables>) {
        return Apollo.useQuery<AutocompleteSchoolTypesQuery, AutocompleteSchoolTypesQueryVariables>(AutocompleteSchoolTypesDocument, baseOptions);
      }
export function useAutocompleteSchoolTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AutocompleteSchoolTypesQuery, AutocompleteSchoolTypesQueryVariables>) {
          return Apollo.useLazyQuery<AutocompleteSchoolTypesQuery, AutocompleteSchoolTypesQueryVariables>(AutocompleteSchoolTypesDocument, baseOptions);
        }
export type AutocompleteSchoolTypesQueryHookResult = ReturnType<typeof useAutocompleteSchoolTypesQuery>;
export type AutocompleteSchoolTypesLazyQueryHookResult = ReturnType<typeof useAutocompleteSchoolTypesLazyQuery>;
export type AutocompleteSchoolTypesQueryResult = Apollo.QueryResult<AutocompleteSchoolTypesQuery, AutocompleteSchoolTypesQueryVariables>;
export const AutocompleteCoursesDocument = gql`
    query AutocompleteCourses($school: ID, $name: String) {
  autocompleteCourses(school: $school, name: $name) {
    id
    name
  }
}
    `;

/**
 * __useAutocompleteCoursesQuery__
 *
 * To run a query within a React component, call `useAutocompleteCoursesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAutocompleteCoursesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAutocompleteCoursesQuery({
 *   variables: {
 *      school: // value for 'school'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useAutocompleteCoursesQuery(baseOptions?: Apollo.QueryHookOptions<AutocompleteCoursesQuery, AutocompleteCoursesQueryVariables>) {
        return Apollo.useQuery<AutocompleteCoursesQuery, AutocompleteCoursesQueryVariables>(AutocompleteCoursesDocument, baseOptions);
      }
export function useAutocompleteCoursesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AutocompleteCoursesQuery, AutocompleteCoursesQueryVariables>) {
          return Apollo.useLazyQuery<AutocompleteCoursesQuery, AutocompleteCoursesQueryVariables>(AutocompleteCoursesDocument, baseOptions);
        }
export type AutocompleteCoursesQueryHookResult = ReturnType<typeof useAutocompleteCoursesQuery>;
export type AutocompleteCoursesLazyQueryHookResult = ReturnType<typeof useAutocompleteCoursesLazyQuery>;
export type AutocompleteCoursesQueryResult = Apollo.QueryResult<AutocompleteCoursesQuery, AutocompleteCoursesQueryVariables>;
export const AutocompleteCountriesDocument = gql`
    query AutocompleteCountries {
  autocompleteCountries {
    id
    name
  }
}
    `;

/**
 * __useAutocompleteCountriesQuery__
 *
 * To run a query within a React component, call `useAutocompleteCountriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAutocompleteCountriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAutocompleteCountriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAutocompleteCountriesQuery(baseOptions?: Apollo.QueryHookOptions<AutocompleteCountriesQuery, AutocompleteCountriesQueryVariables>) {
        return Apollo.useQuery<AutocompleteCountriesQuery, AutocompleteCountriesQueryVariables>(AutocompleteCountriesDocument, baseOptions);
      }
export function useAutocompleteCountriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AutocompleteCountriesQuery, AutocompleteCountriesQueryVariables>) {
          return Apollo.useLazyQuery<AutocompleteCountriesQuery, AutocompleteCountriesQueryVariables>(AutocompleteCountriesDocument, baseOptions);
        }
export type AutocompleteCountriesQueryHookResult = ReturnType<typeof useAutocompleteCountriesQuery>;
export type AutocompleteCountriesLazyQueryHookResult = ReturnType<typeof useAutocompleteCountriesLazyQuery>;
export type AutocompleteCountriesQueryResult = Apollo.QueryResult<AutocompleteCountriesQuery, AutocompleteCountriesQueryVariables>;
export const AutocompleteCitiesDocument = gql`
    query AutocompleteCities {
  autocompleteCities {
    id
    name
  }
}
    `;

/**
 * __useAutocompleteCitiesQuery__
 *
 * To run a query within a React component, call `useAutocompleteCitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAutocompleteCitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAutocompleteCitiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAutocompleteCitiesQuery(baseOptions?: Apollo.QueryHookOptions<AutocompleteCitiesQuery, AutocompleteCitiesQueryVariables>) {
        return Apollo.useQuery<AutocompleteCitiesQuery, AutocompleteCitiesQueryVariables>(AutocompleteCitiesDocument, baseOptions);
      }
export function useAutocompleteCitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AutocompleteCitiesQuery, AutocompleteCitiesQueryVariables>) {
          return Apollo.useLazyQuery<AutocompleteCitiesQuery, AutocompleteCitiesQueryVariables>(AutocompleteCitiesDocument, baseOptions);
        }
export type AutocompleteCitiesQueryHookResult = ReturnType<typeof useAutocompleteCitiesQuery>;
export type AutocompleteCitiesLazyQueryHookResult = ReturnType<typeof useAutocompleteCitiesLazyQuery>;
export type AutocompleteCitiesQueryResult = Apollo.QueryResult<AutocompleteCitiesQuery, AutocompleteCitiesQueryVariables>;
export const AutocompleteResourceTypesDocument = gql`
    query AutocompleteResourceTypes {
  autocompleteResourceTypes {
    id
    name
  }
}
    `;

/**
 * __useAutocompleteResourceTypesQuery__
 *
 * To run a query within a React component, call `useAutocompleteResourceTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAutocompleteResourceTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAutocompleteResourceTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAutocompleteResourceTypesQuery(baseOptions?: Apollo.QueryHookOptions<AutocompleteResourceTypesQuery, AutocompleteResourceTypesQueryVariables>) {
        return Apollo.useQuery<AutocompleteResourceTypesQuery, AutocompleteResourceTypesQueryVariables>(AutocompleteResourceTypesDocument, baseOptions);
      }
export function useAutocompleteResourceTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AutocompleteResourceTypesQuery, AutocompleteResourceTypesQueryVariables>) {
          return Apollo.useLazyQuery<AutocompleteResourceTypesQuery, AutocompleteResourceTypesQueryVariables>(AutocompleteResourceTypesDocument, baseOptions);
        }
export type AutocompleteResourceTypesQueryHookResult = ReturnType<typeof useAutocompleteResourceTypesQuery>;
export type AutocompleteResourceTypesLazyQueryHookResult = ReturnType<typeof useAutocompleteResourceTypesLazyQuery>;
export type AutocompleteResourceTypesQueryResult = Apollo.QueryResult<AutocompleteResourceTypesQuery, AutocompleteResourceTypesQueryVariables>;
export const AutocompleteSubjectsDocument = gql`
    query AutocompleteSubjects {
  autocompleteSubjects {
    id
    name
  }
}
    `;

/**
 * __useAutocompleteSubjectsQuery__
 *
 * To run a query within a React component, call `useAutocompleteSubjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAutocompleteSubjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAutocompleteSubjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAutocompleteSubjectsQuery(baseOptions?: Apollo.QueryHookOptions<AutocompleteSubjectsQuery, AutocompleteSubjectsQueryVariables>) {
        return Apollo.useQuery<AutocompleteSubjectsQuery, AutocompleteSubjectsQueryVariables>(AutocompleteSubjectsDocument, baseOptions);
      }
export function useAutocompleteSubjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AutocompleteSubjectsQuery, AutocompleteSubjectsQueryVariables>) {
          return Apollo.useLazyQuery<AutocompleteSubjectsQuery, AutocompleteSubjectsQueryVariables>(AutocompleteSubjectsDocument, baseOptions);
        }
export type AutocompleteSubjectsQueryHookResult = ReturnType<typeof useAutocompleteSubjectsQuery>;
export type AutocompleteSubjectsLazyQueryHookResult = ReturnType<typeof useAutocompleteSubjectsLazyQuery>;
export type AutocompleteSubjectsQueryResult = Apollo.QueryResult<AutocompleteSubjectsQuery, AutocompleteSubjectsQueryVariables>;