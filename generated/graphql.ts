import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
const gql = Apollo.gql;
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
  subjects?: Maybe<Array<Maybe<SubjectObjectType>>>;
  subject?: Maybe<SubjectObjectType>;
  schoolTypes?: Maybe<Array<Maybe<SchoolTypeObjectType>>>;
  schoolType?: Maybe<SchoolTypeObjectType>;
  schools?: Maybe<Array<Maybe<SchoolObjectType>>>;
  school?: Maybe<SchoolObjectType>;
  resourceTypes?: Maybe<Array<Maybe<ResourceTypeObjectType>>>;
  resource?: Maybe<ResourceObjectType>;
  searchCourses?: Maybe<PaginatedCourseObjectType>;
  courses?: Maybe<Array<Maybe<CourseObjectType>>>;
  course?: Maybe<CourseObjectType>;
  countries?: Maybe<Array<Maybe<CountryObjectType>>>;
  country?: Maybe<CountryObjectType>;
  cities?: Maybe<Array<Maybe<CityObjectType>>>;
  city?: Maybe<CityObjectType>;
};


export type QueryUserArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QuerySubjectArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QuerySchoolTypeArgs = {
  id?: Maybe<Scalars['ID']>;
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


export type QueryCoursesArgs = {
  school?: Maybe<Scalars['ID']>;
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
  createdCourses: Array<CourseObjectType>;
  createdResources: Array<ResourceObjectType>;
  activity?: Maybe<Array<Maybe<ActivityObjectType>>>;
  avatarThumbnail?: Maybe<Scalars['String']>;
  school?: Maybe<SchoolObjectType>;
  subject?: Maybe<SubjectObjectType>;
  rank?: Maybe<Scalars['String']>;
  badges?: Maybe<Array<Maybe<BadgeObjectType>>>;
  starredCourses?: Maybe<Array<Maybe<CourseObjectType>>>;
  starredResources?: Maybe<Array<Maybe<ResourceObjectType>>>;
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
  resources: Array<ResourceObjectType>;
  comments: Array<CommentObjectType>;
  starred?: Maybe<Scalars['Boolean']>;
  score?: Maybe<Scalars['Int']>;
  vote?: Maybe<VoteObjectType>;
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

export type ResourceObjectType = {
  __typename?: 'ResourceObjectType';
  id: Scalars['ID'];
  resourceType?: Maybe<Scalars['String']>;
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

export type VoteObjectType = {
  __typename?: 'VoteObjectType';
  id: Scalars['ID'];
  user: UserObjectType;
  status?: Maybe<Scalars['Int']>;
  comment?: Maybe<CommentObjectType>;
  course?: Maybe<CourseObjectType>;
  resource?: Maybe<ResourceObjectType>;
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

export type BadgeObjectType = {
  __typename?: 'BadgeObjectType';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type ResourceTypeObjectType = {
  __typename?: 'ResourceTypeObjectType';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
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
  /**
   * Update some user model fields.
   * 
   * The user must be verified.
   */
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
   * The user must be verified and must confirm his password.
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
  user?: Maybe<UserObjectType>;
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type RegisterMutationInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  code: Scalars['String'];
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

/**
 * Update some user model fields.
 * 
 * The user must be verified.
 */
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
 * The user must be verified and must confirm his password.
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
  file?: Maybe<Scalars['String']>;
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
  activity?: Maybe<Array<Maybe<ActivityObjectType>>>;
};

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  code: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register?: Maybe<(
    { __typename?: 'RegisterMutationPayload' }
    & { user?: Maybe<(
      { __typename?: 'UserObjectType' }
      & Pick<UserObjectType, 'username' | 'email'>
    )>, errors?: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )>, login?: Maybe<(
    { __typename?: 'LoginMutationPayload' }
    & { errors?: Maybe<Array<Maybe<(
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

export type DeleteAccountMutationVariables = Exact<{
  password: Scalars['String'];
}>;


export type DeleteAccountMutation = (
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

export type ContactMutationVariables = Exact<{
  subject: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  message: Scalars['String'];
}>;


export type ContactMutation = (
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

export type MarkSingleActivityReadMutationVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
  read?: Maybe<Scalars['Boolean']>;
}>;


export type MarkSingleActivityReadMutation = (
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
    )>>>, activity?: Maybe<Array<Maybe<(
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
      & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'score'>
    )>>>, starredResources?: Maybe<Array<Maybe<(
      { __typename?: 'ResourceObjectType' }
      & Pick<ResourceObjectType, 'id' | 'title' | 'score' | 'date'>
    )>>> }
  )> }
);

export type UserDetailQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type UserDetailQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'UserObjectType' }
    & Pick<UserObjectType, 'id' | 'username' | 'title' | 'bio' | 'avatar' | 'score' | 'created' | 'verified' | 'rank'>
    & { badges?: Maybe<Array<Maybe<(
      { __typename?: 'BadgeObjectType' }
      & Pick<BadgeObjectType, 'id' | 'name' | 'description'>
    )>>>, createdCourses: Array<(
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'score'>
    )>, createdResources: Array<(
      { __typename?: 'ResourceObjectType' }
      & Pick<ResourceObjectType, 'id' | 'title' | 'score' | 'date'>
    )> }
  )> }
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
      & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'score'>
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

export type CourseDetailQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type CourseDetailQuery = (
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
  )> }
);

export type ResourceDetailQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type ResourceDetailQuery = (
  { __typename?: 'Query' }
  & { resource?: Maybe<(
    { __typename?: 'ResourceObjectType' }
    & Pick<ResourceObjectType, 'id' | 'title' | 'resourceType' | 'file' | 'date' | 'modified' | 'created' | 'score' | 'starred'>
    & { school?: Maybe<(
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

export type SchoolDetailQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type SchoolDetailQuery = (
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
      & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'score'>
    )> }
  )> }
);

export type CreateResourceInitialDataQueryVariables = Exact<{
  school?: Maybe<Scalars['ID']>;
  course?: Maybe<Scalars['ID']>;
}>;


export type CreateResourceInitialDataQuery = (
  { __typename?: 'Query' }
  & { school?: Maybe<(
    { __typename?: 'SchoolObjectType' }
    & Pick<SchoolObjectType, 'id' | 'name'>
  )>, course?: Maybe<(
    { __typename?: 'CourseObjectType' }
    & Pick<CourseObjectType, 'id' | 'name'>
  )> }
);

export type SchoolsQueryVariables = Exact<{ [key: string]: never; }>;


export type SchoolsQuery = (
  { __typename?: 'Query' }
  & { schools?: Maybe<Array<Maybe<(
    { __typename?: 'SchoolObjectType' }
    & Pick<SchoolObjectType, 'id' | 'name'>
  )>>> }
);

export type SchoolTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type SchoolTypesQuery = (
  { __typename?: 'Query' }
  & { schoolTypes?: Maybe<Array<Maybe<(
    { __typename?: 'SchoolTypeObjectType' }
    & Pick<SchoolTypeObjectType, 'id' | 'name'>
  )>>> }
);

export type CoursesQueryVariables = Exact<{
  school?: Maybe<Scalars['ID']>;
}>;


export type CoursesQuery = (
  { __typename?: 'Query' }
  & { courses?: Maybe<Array<Maybe<(
    { __typename?: 'CourseObjectType' }
    & Pick<CourseObjectType, 'id' | 'name'>
  )>>> }
);

export type CountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CountriesQuery = (
  { __typename?: 'Query' }
  & { countries?: Maybe<Array<Maybe<(
    { __typename?: 'CountryObjectType' }
    & Pick<CountryObjectType, 'id' | 'name'>
  )>>> }
);

export type CitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type CitiesQuery = (
  { __typename?: 'Query' }
  & { cities?: Maybe<Array<Maybe<(
    { __typename?: 'CityObjectType' }
    & Pick<CityObjectType, 'id' | 'name'>
  )>>> }
);

export type ResourceTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type ResourceTypesQuery = (
  { __typename?: 'Query' }
  & { resourceTypes?: Maybe<Array<Maybe<(
    { __typename?: 'ResourceTypeObjectType' }
    & Pick<ResourceTypeObjectType, 'id' | 'name'>
  )>>> }
);

export type SubjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type SubjectsQuery = (
  { __typename?: 'Query' }
  & { subjects?: Maybe<Array<Maybe<(
    { __typename?: 'SubjectObjectType' }
    & Pick<SubjectObjectType, 'id' | 'name'>
  )>>> }
);


export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!, $code: String!) {
  register(input: {username: $username, email: $email, password: $password, code: $code}) {
    user {
      username
      email
    }
    errors {
      field
      messages
    }
  }
  login(input: {usernameOrEmail: $username, password: $password}) {
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
 *      code: // value for 'code'
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
export const DeleteAccountDocument = gql`
    mutation DeleteAccount($password: String!) {
  deleteUser(input: {password: $password}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type DeleteAccountMutationFn = Apollo.MutationFunction<DeleteAccountMutation, DeleteAccountMutationVariables>;

/**
 * __useDeleteAccountMutation__
 *
 * To run a mutation, you first call `useDeleteAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAccountMutation, { data, loading, error }] = useDeleteAccountMutation({
 *   variables: {
 *      password: // value for 'password'
 *   },
 * });
 */
export function useDeleteAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>) {
        return Apollo.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, baseOptions);
      }
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>;
export type DeleteAccountMutationResult = Apollo.MutationResult<DeleteAccountMutation>;
export type DeleteAccountMutationOptions = Apollo.BaseMutationOptions<DeleteAccountMutation, DeleteAccountMutationVariables>;
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
export const ContactDocument = gql`
    mutation Contact($subject: String!, $name: String, $email: String!, $message: String!) {
  createContactMessage(input: {subject: $subject, name: $name, email: $email, message: $message}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type ContactMutationFn = Apollo.MutationFunction<ContactMutation, ContactMutationVariables>;

/**
 * __useContactMutation__
 *
 * To run a mutation, you first call `useContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [contactMutation, { data, loading, error }] = useContactMutation({
 *   variables: {
 *      subject: // value for 'subject'
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      message: // value for 'message'
 *   },
 * });
 */
export function useContactMutation(baseOptions?: Apollo.MutationHookOptions<ContactMutation, ContactMutationVariables>) {
        return Apollo.useMutation<ContactMutation, ContactMutationVariables>(ContactDocument, baseOptions);
      }
export type ContactMutationHookResult = ReturnType<typeof useContactMutation>;
export type ContactMutationResult = Apollo.MutationResult<ContactMutation>;
export type ContactMutationOptions = Apollo.BaseMutationOptions<ContactMutation, ContactMutationVariables>;
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
export const MarkSingleActivityReadDocument = gql`
    mutation MarkSingleActivityRead($id: ID, $read: Boolean) {
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
export type MarkSingleActivityReadMutationFn = Apollo.MutationFunction<MarkSingleActivityReadMutation, MarkSingleActivityReadMutationVariables>;

/**
 * __useMarkSingleActivityReadMutation__
 *
 * To run a mutation, you first call `useMarkSingleActivityReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkSingleActivityReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markSingleActivityReadMutation, { data, loading, error }] = useMarkSingleActivityReadMutation({
 *   variables: {
 *      id: // value for 'id'
 *      read: // value for 'read'
 *   },
 * });
 */
export function useMarkSingleActivityReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkSingleActivityReadMutation, MarkSingleActivityReadMutationVariables>) {
        return Apollo.useMutation<MarkSingleActivityReadMutation, MarkSingleActivityReadMutationVariables>(MarkSingleActivityReadDocument, baseOptions);
      }
export type MarkSingleActivityReadMutationHookResult = ReturnType<typeof useMarkSingleActivityReadMutation>;
export type MarkSingleActivityReadMutationResult = Apollo.MutationResult<MarkSingleActivityReadMutation>;
export type MarkSingleActivityReadMutationOptions = Apollo.BaseMutationOptions<MarkSingleActivityReadMutation, MarkSingleActivityReadMutationVariables>;
export const MarkAllActivitiesAsReadDocument = gql`
    mutation MarkAllActivitiesAsRead {
  markAllActivitiesRead {
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
    }
    starredResources {
      id
      title
      score
      date
    }
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
export const UserDetailDocument = gql`
    query UserDetail($id: ID) {
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
    }
    createdResources {
      id
      title
      score
      date
    }
  }
}
    `;

/**
 * __useUserDetailQuery__
 *
 * To run a query within a React component, call `useUserDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserDetailQuery(baseOptions?: Apollo.QueryHookOptions<UserDetailQuery, UserDetailQueryVariables>) {
        return Apollo.useQuery<UserDetailQuery, UserDetailQueryVariables>(UserDetailDocument, baseOptions);
      }
export function useUserDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserDetailQuery, UserDetailQueryVariables>) {
          return Apollo.useLazyQuery<UserDetailQuery, UserDetailQueryVariables>(UserDetailDocument, baseOptions);
        }
export type UserDetailQueryHookResult = ReturnType<typeof useUserDetailQuery>;
export type UserDetailLazyQueryHookResult = ReturnType<typeof useUserDetailLazyQuery>;
export type UserDetailQueryResult = Apollo.QueryResult<UserDetailQuery, UserDetailQueryVariables>;
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
export const CourseDetailDocument = gql`
    query CourseDetail($id: ID) {
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
}
    `;

/**
 * __useCourseDetailQuery__
 *
 * To run a query within a React component, call `useCourseDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useCourseDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCourseDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCourseDetailQuery(baseOptions?: Apollo.QueryHookOptions<CourseDetailQuery, CourseDetailQueryVariables>) {
        return Apollo.useQuery<CourseDetailQuery, CourseDetailQueryVariables>(CourseDetailDocument, baseOptions);
      }
export function useCourseDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CourseDetailQuery, CourseDetailQueryVariables>) {
          return Apollo.useLazyQuery<CourseDetailQuery, CourseDetailQueryVariables>(CourseDetailDocument, baseOptions);
        }
export type CourseDetailQueryHookResult = ReturnType<typeof useCourseDetailQuery>;
export type CourseDetailLazyQueryHookResult = ReturnType<typeof useCourseDetailLazyQuery>;
export type CourseDetailQueryResult = Apollo.QueryResult<CourseDetailQuery, CourseDetailQueryVariables>;
export const ResourceDetailDocument = gql`
    query ResourceDetail($id: ID) {
  resource(id: $id) {
    id
    title
    resourceType
    file
    date
    modified
    created
    score
    starred
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
      user {
        id
        username
        avatarThumbnail
      }
      id
      text
      attachment
      modified
      created
      modified
      created
      score
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
 * __useResourceDetailQuery__
 *
 * To run a query within a React component, call `useResourceDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useResourceDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResourceDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useResourceDetailQuery(baseOptions?: Apollo.QueryHookOptions<ResourceDetailQuery, ResourceDetailQueryVariables>) {
        return Apollo.useQuery<ResourceDetailQuery, ResourceDetailQueryVariables>(ResourceDetailDocument, baseOptions);
      }
export function useResourceDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResourceDetailQuery, ResourceDetailQueryVariables>) {
          return Apollo.useLazyQuery<ResourceDetailQuery, ResourceDetailQueryVariables>(ResourceDetailDocument, baseOptions);
        }
export type ResourceDetailQueryHookResult = ReturnType<typeof useResourceDetailQuery>;
export type ResourceDetailLazyQueryHookResult = ReturnType<typeof useResourceDetailLazyQuery>;
export type ResourceDetailQueryResult = Apollo.QueryResult<ResourceDetailQuery, ResourceDetailQueryVariables>;
export const SchoolDetailDocument = gql`
    query SchoolDetail($id: ID) {
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
    }
  }
}
    `;

/**
 * __useSchoolDetailQuery__
 *
 * To run a query within a React component, call `useSchoolDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSchoolDetailQuery(baseOptions?: Apollo.QueryHookOptions<SchoolDetailQuery, SchoolDetailQueryVariables>) {
        return Apollo.useQuery<SchoolDetailQuery, SchoolDetailQueryVariables>(SchoolDetailDocument, baseOptions);
      }
export function useSchoolDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolDetailQuery, SchoolDetailQueryVariables>) {
          return Apollo.useLazyQuery<SchoolDetailQuery, SchoolDetailQueryVariables>(SchoolDetailDocument, baseOptions);
        }
export type SchoolDetailQueryHookResult = ReturnType<typeof useSchoolDetailQuery>;
export type SchoolDetailLazyQueryHookResult = ReturnType<typeof useSchoolDetailLazyQuery>;
export type SchoolDetailQueryResult = Apollo.QueryResult<SchoolDetailQuery, SchoolDetailQueryVariables>;
export const CreateResourceInitialDataDocument = gql`
    query CreateResourceInitialData($school: ID, $course: ID) {
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
 * __useCreateResourceInitialDataQuery__
 *
 * To run a query within a React component, call `useCreateResourceInitialDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useCreateResourceInitialDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreateResourceInitialDataQuery({
 *   variables: {
 *      school: // value for 'school'
 *      course: // value for 'course'
 *   },
 * });
 */
export function useCreateResourceInitialDataQuery(baseOptions?: Apollo.QueryHookOptions<CreateResourceInitialDataQuery, CreateResourceInitialDataQueryVariables>) {
        return Apollo.useQuery<CreateResourceInitialDataQuery, CreateResourceInitialDataQueryVariables>(CreateResourceInitialDataDocument, baseOptions);
      }
export function useCreateResourceInitialDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CreateResourceInitialDataQuery, CreateResourceInitialDataQueryVariables>) {
          return Apollo.useLazyQuery<CreateResourceInitialDataQuery, CreateResourceInitialDataQueryVariables>(CreateResourceInitialDataDocument, baseOptions);
        }
export type CreateResourceInitialDataQueryHookResult = ReturnType<typeof useCreateResourceInitialDataQuery>;
export type CreateResourceInitialDataLazyQueryHookResult = ReturnType<typeof useCreateResourceInitialDataLazyQuery>;
export type CreateResourceInitialDataQueryResult = Apollo.QueryResult<CreateResourceInitialDataQuery, CreateResourceInitialDataQueryVariables>;
export const SchoolsDocument = gql`
    query Schools {
  schools {
    id
    name
  }
}
    `;

/**
 * __useSchoolsQuery__
 *
 * To run a query within a React component, call `useSchoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSchoolsQuery(baseOptions?: Apollo.QueryHookOptions<SchoolsQuery, SchoolsQueryVariables>) {
        return Apollo.useQuery<SchoolsQuery, SchoolsQueryVariables>(SchoolsDocument, baseOptions);
      }
export function useSchoolsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolsQuery, SchoolsQueryVariables>) {
          return Apollo.useLazyQuery<SchoolsQuery, SchoolsQueryVariables>(SchoolsDocument, baseOptions);
        }
export type SchoolsQueryHookResult = ReturnType<typeof useSchoolsQuery>;
export type SchoolsLazyQueryHookResult = ReturnType<typeof useSchoolsLazyQuery>;
export type SchoolsQueryResult = Apollo.QueryResult<SchoolsQuery, SchoolsQueryVariables>;
export const SchoolTypesDocument = gql`
    query SchoolTypes {
  schoolTypes {
    id
    name
  }
}
    `;

/**
 * __useSchoolTypesQuery__
 *
 * To run a query within a React component, call `useSchoolTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useSchoolTypesQuery(baseOptions?: Apollo.QueryHookOptions<SchoolTypesQuery, SchoolTypesQueryVariables>) {
        return Apollo.useQuery<SchoolTypesQuery, SchoolTypesQueryVariables>(SchoolTypesDocument, baseOptions);
      }
export function useSchoolTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolTypesQuery, SchoolTypesQueryVariables>) {
          return Apollo.useLazyQuery<SchoolTypesQuery, SchoolTypesQueryVariables>(SchoolTypesDocument, baseOptions);
        }
export type SchoolTypesQueryHookResult = ReturnType<typeof useSchoolTypesQuery>;
export type SchoolTypesLazyQueryHookResult = ReturnType<typeof useSchoolTypesLazyQuery>;
export type SchoolTypesQueryResult = Apollo.QueryResult<SchoolTypesQuery, SchoolTypesQueryVariables>;
export const CoursesDocument = gql`
    query Courses($school: ID) {
  courses(school: $school) {
    id
    name
  }
}
    `;

/**
 * __useCoursesQuery__
 *
 * To run a query within a React component, call `useCoursesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCoursesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCoursesQuery({
 *   variables: {
 *      school: // value for 'school'
 *   },
 * });
 */
export function useCoursesQuery(baseOptions?: Apollo.QueryHookOptions<CoursesQuery, CoursesQueryVariables>) {
        return Apollo.useQuery<CoursesQuery, CoursesQueryVariables>(CoursesDocument, baseOptions);
      }
export function useCoursesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CoursesQuery, CoursesQueryVariables>) {
          return Apollo.useLazyQuery<CoursesQuery, CoursesQueryVariables>(CoursesDocument, baseOptions);
        }
export type CoursesQueryHookResult = ReturnType<typeof useCoursesQuery>;
export type CoursesLazyQueryHookResult = ReturnType<typeof useCoursesLazyQuery>;
export type CoursesQueryResult = Apollo.QueryResult<CoursesQuery, CoursesQueryVariables>;
export const CountriesDocument = gql`
    query Countries {
  countries {
    id
    name
  }
}
    `;

/**
 * __useCountriesQuery__
 *
 * To run a query within a React component, call `useCountriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCountriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCountriesQuery(baseOptions?: Apollo.QueryHookOptions<CountriesQuery, CountriesQueryVariables>) {
        return Apollo.useQuery<CountriesQuery, CountriesQueryVariables>(CountriesDocument, baseOptions);
      }
export function useCountriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CountriesQuery, CountriesQueryVariables>) {
          return Apollo.useLazyQuery<CountriesQuery, CountriesQueryVariables>(CountriesDocument, baseOptions);
        }
export type CountriesQueryHookResult = ReturnType<typeof useCountriesQuery>;
export type CountriesLazyQueryHookResult = ReturnType<typeof useCountriesLazyQuery>;
export type CountriesQueryResult = Apollo.QueryResult<CountriesQuery, CountriesQueryVariables>;
export const CitiesDocument = gql`
    query Cities {
  cities {
    id
    name
  }
}
    `;

/**
 * __useCitiesQuery__
 *
 * To run a query within a React component, call `useCitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCitiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCitiesQuery(baseOptions?: Apollo.QueryHookOptions<CitiesQuery, CitiesQueryVariables>) {
        return Apollo.useQuery<CitiesQuery, CitiesQueryVariables>(CitiesDocument, baseOptions);
      }
export function useCitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CitiesQuery, CitiesQueryVariables>) {
          return Apollo.useLazyQuery<CitiesQuery, CitiesQueryVariables>(CitiesDocument, baseOptions);
        }
export type CitiesQueryHookResult = ReturnType<typeof useCitiesQuery>;
export type CitiesLazyQueryHookResult = ReturnType<typeof useCitiesLazyQuery>;
export type CitiesQueryResult = Apollo.QueryResult<CitiesQuery, CitiesQueryVariables>;
export const ResourceTypesDocument = gql`
    query ResourceTypes {
  resourceTypes {
    id
    name
  }
}
    `;

/**
 * __useResourceTypesQuery__
 *
 * To run a query within a React component, call `useResourceTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useResourceTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResourceTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useResourceTypesQuery(baseOptions?: Apollo.QueryHookOptions<ResourceTypesQuery, ResourceTypesQueryVariables>) {
        return Apollo.useQuery<ResourceTypesQuery, ResourceTypesQueryVariables>(ResourceTypesDocument, baseOptions);
      }
export function useResourceTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResourceTypesQuery, ResourceTypesQueryVariables>) {
          return Apollo.useLazyQuery<ResourceTypesQuery, ResourceTypesQueryVariables>(ResourceTypesDocument, baseOptions);
        }
export type ResourceTypesQueryHookResult = ReturnType<typeof useResourceTypesQuery>;
export type ResourceTypesLazyQueryHookResult = ReturnType<typeof useResourceTypesLazyQuery>;
export type ResourceTypesQueryResult = Apollo.QueryResult<ResourceTypesQuery, ResourceTypesQueryVariables>;
export const SubjectsDocument = gql`
    query Subjects {
  subjects {
    id
    name
  }
}
    `;

/**
 * __useSubjectsQuery__
 *
 * To run a query within a React component, call `useSubjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSubjectsQuery(baseOptions?: Apollo.QueryHookOptions<SubjectsQuery, SubjectsQueryVariables>) {
        return Apollo.useQuery<SubjectsQuery, SubjectsQueryVariables>(SubjectsDocument, baseOptions);
      }
export function useSubjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubjectsQuery, SubjectsQueryVariables>) {
          return Apollo.useLazyQuery<SubjectsQuery, SubjectsQueryVariables>(SubjectsDocument, baseOptions);
        }
export type SubjectsQueryHookResult = ReturnType<typeof useSubjectsQuery>;
export type SubjectsLazyQueryHookResult = ReturnType<typeof useSubjectsLazyQuery>;
export type SubjectsQueryResult = Apollo.QueryResult<SubjectsQuery, SubjectsQueryVariables>;