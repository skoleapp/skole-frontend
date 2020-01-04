import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** 
 * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
 **/
  DateTime: any,
  /** 
 * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
 **/
  Date: any,
};

export type ChangePasswordMutationInput = {
  oldPassword: Scalars['String'],
  newPassword: Scalars['String'],
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type ChangePasswordMutationPayload = {
   __typename?: 'ChangePasswordMutationPayload',
  user?: Maybe<UserType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CityType = {
   __typename?: 'CityType',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type CommentType = {
   __typename?: 'CommentType',
  id: Scalars['ID'],
  creator?: Maybe<UserType>,
  text: Scalars['String'],
  attachment?: Maybe<Scalars['String']>,
  course?: Maybe<CourseType>,
  resource?: Maybe<ResourceType>,
  resourcePart?: Maybe<ResourcePartType>,
  modified: Scalars['DateTime'],
  created: Scalars['DateTime'],
  points?: Maybe<Scalars['Int']>,
};

export type ContactMutationInput = {
  contactType: Scalars['String'],
  email: Scalars['String'],
  message: Scalars['String'],
  clientMutationId?: Maybe<Scalars['String']>,
};

export type ContactMutationPayload = {
   __typename?: 'ContactMutationPayload',
  contactType: Scalars['String'],
  email: Scalars['String'],
  message?: Maybe<Scalars['String']>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CountryType = {
   __typename?: 'CountryType',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type CourseType = {
   __typename?: 'CourseType',
  id: Scalars['ID'],
  name: Scalars['String'],
  code?: Maybe<Scalars['String']>,
  subject: SubjectType,
  school: SchoolType,
  creator?: Maybe<UserType>,
  modified: Scalars['DateTime'],
  created: Scalars['DateTime'],
  resources: Array<ResourceType>,
  points?: Maybe<Scalars['Int']>,
  resourceCount?: Maybe<Scalars['Int']>,
};

export type CreateCommentMutationInput = {
  text: Scalars['String'],
  attachment?: Maybe<Scalars['String']>,
  course?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>,
  resourcePart?: Maybe<Scalars['ID']>,
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CreateCommentMutationPayload = {
   __typename?: 'CreateCommentMutationPayload',
  comment?: Maybe<CommentType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CreateCourseMutationInput = {
  name: Scalars['String'],
  code?: Maybe<Scalars['String']>,
  subject: Scalars['ID'],
  school: Scalars['ID'],
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CreateCourseMutationPayload = {
   __typename?: 'CreateCourseMutationPayload',
  course?: Maybe<CourseType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};



export type DeleteUserMutationInput = {
  password: Scalars['String'],
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type DeleteUserMutationPayload = {
   __typename?: 'DeleteUserMutationPayload',
  user?: Maybe<UserType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  message?: Maybe<Scalars['String']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type DownvoteCommentMutation = {
   __typename?: 'DownvoteCommentMutation',
  comment?: Maybe<CommentType>,
};

export type DownvoteCourseMutation = {
   __typename?: 'DownvoteCourseMutation',
  course?: Maybe<CourseType>,
};

export type DownvoteResourceMutation = {
   __typename?: 'DownvoteResourceMutation',
  resource?: Maybe<ResourceType>,
};

export type ErrorType = {
   __typename?: 'ErrorType',
  field: Scalars['String'],
  messages: Array<Scalars['String']>,
};

export type Mutation = {
   __typename?: 'Mutation',
  signUp?: Maybe<SignUpMutationPayload>,
  signIn?: Maybe<SignInMutationPayload>,
  updateUser?: Maybe<UpdateUserMutationPayload>,
  changePassword?: Maybe<ChangePasswordMutationPayload>,
  deleteUser?: Maybe<DeleteUserMutationPayload>,
  upvoteResource?: Maybe<UpvoteResourceMutation>,
  downvoteResource?: Maybe<DownvoteResourceMutation>,
  uploadResource?: Maybe<UploadResourceMutationPayload>,
  createCourse?: Maybe<CreateCourseMutationPayload>,
  upvoteCourse?: Maybe<UpvoteCourseMutation>,
  downvoteCourse?: Maybe<DownvoteCourseMutation>,
  contact?: Maybe<ContactMutationPayload>,
  upvoteComment?: Maybe<UpvoteCommentMutation>,
  downvoteComment?: Maybe<DownvoteCommentMutation>,
  createComment?: Maybe<CreateCommentMutationPayload>,
  updateComment?: Maybe<UpdateCommentMutationPayload>,
};


export type MutationSignUpArgs = {
  input: SignUpMutationInput
};


export type MutationSignInArgs = {
  input: SignInMutationInput
};


export type MutationUpdateUserArgs = {
  input: UpdateUserMutationInput
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordMutationInput
};


export type MutationDeleteUserArgs = {
  input: DeleteUserMutationInput
};


export type MutationUpvoteResourceArgs = {
  resourceId?: Maybe<Scalars['Int']>
};


export type MutationDownvoteResourceArgs = {
  resourceId?: Maybe<Scalars['Int']>
};


export type MutationUploadResourceArgs = {
  input: UploadResourceMutationInput
};


export type MutationCreateCourseArgs = {
  input: CreateCourseMutationInput
};


export type MutationUpvoteCourseArgs = {
  courseId?: Maybe<Scalars['Int']>
};


export type MutationDownvoteCourseArgs = {
  courseId?: Maybe<Scalars['Int']>
};


export type MutationContactArgs = {
  input: ContactMutationInput
};


export type MutationUpvoteCommentArgs = {
  commentId?: Maybe<Scalars['Int']>
};


export type MutationDownvoteCommentArgs = {
  commentId?: Maybe<Scalars['Int']>
};


export type MutationCreateCommentArgs = {
  input: CreateCommentMutationInput
};


export type MutationUpdateCommentArgs = {
  input: UpdateCommentMutationInput
};

export type Query = {
   __typename?: 'Query',
  cities?: Maybe<Array<Maybe<CityType>>>,
  city?: Maybe<CityType>,
  countries?: Maybe<Array<Maybe<CountryType>>>,
  country?: Maybe<CountryType>,
  users?: Maybe<Array<Maybe<UserType>>>,
  user?: Maybe<UserType>,
  userMe?: Maybe<UserType>,
  subjects?: Maybe<Array<Maybe<SubjectType>>>,
  subject?: Maybe<SubjectType>,
  schoolTypes?: Maybe<Array<Maybe<SchoolTypeObjectType>>>,
  schoolType?: Maybe<SchoolTypeObjectType>,
  schools?: Maybe<Array<Maybe<SchoolType>>>,
  school?: Maybe<SchoolType>,
  resourceTypes?: Maybe<Array<Maybe<ResourceTypeObjectType>>>,
  resource?: Maybe<ResourceType>,
  courses?: Maybe<Array<Maybe<CourseType>>>,
  course?: Maybe<CourseType>,
  comments?: Maybe<Array<Maybe<CommentType>>>,
  comment?: Maybe<CommentType>,
};


export type QueryCityArgs = {
  cityId?: Maybe<Scalars['Int']>
};


export type QueryCountryArgs = {
  countryId?: Maybe<Scalars['Int']>
};


export type QueryUserArgs = {
  userId: Scalars['Int']
};


export type QuerySubjectArgs = {
  subjectId?: Maybe<Scalars['Int']>
};


export type QuerySchoolTypeArgs = {
  schoolTypeId?: Maybe<Scalars['Int']>
};


export type QuerySchoolArgs = {
  schoolId?: Maybe<Scalars['Int']>
};


export type QueryResourceArgs = {
  resourceId: Scalars['Int']
};


export type QueryCoursesArgs = {
  courseName?: Maybe<Scalars['String']>,
  courseCode?: Maybe<Scalars['String']>,
  subjectId?: Maybe<Scalars['Int']>,
  schoolId?: Maybe<Scalars['Int']>,
  schoolTypeId?: Maybe<Scalars['Int']>,
  countryId?: Maybe<Scalars['Int']>,
  cityId?: Maybe<Scalars['Int']>
};


export type QueryCourseArgs = {
  courseId?: Maybe<Scalars['Int']>
};


export type QueryCommentsArgs = {
  courseId?: Maybe<Scalars['String']>,
  resourceId?: Maybe<Scalars['Int']>,
  resourcePartId?: Maybe<Scalars['Int']>
};


export type QueryCommentArgs = {
  commentId?: Maybe<Scalars['Int']>
};

export type ResourcePartType = {
   __typename?: 'ResourcePartType',
  id: Scalars['ID'],
  title?: Maybe<Scalars['String']>,
  file?: Maybe<Scalars['String']>,
  text?: Maybe<Scalars['String']>,
};

export type ResourceType = {
   __typename?: 'ResourceType',
  id: Scalars['ID'],
  resourceType?: Maybe<Scalars['String']>,
  title: Scalars['String'],
  file: Scalars['String'],
  date: Scalars['Date'],
  creator?: Maybe<UserType>,
  modified: Scalars['DateTime'],
  created: Scalars['DateTime'],
  resourceParts: Array<ResourcePartType>,
  points?: Maybe<Scalars['Int']>,
};

export type ResourceTypeObjectType = {
   __typename?: 'ResourceTypeObjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
  hasParts: Scalars['Boolean'],
};

export type SchoolType = {
   __typename?: 'SchoolType',
  id: Scalars['ID'],
  name: Scalars['String'],
  schoolType?: Maybe<Scalars['String']>,
  city?: Maybe<Scalars['String']>,
  country?: Maybe<Scalars['String']>,
  subjectCount?: Maybe<Scalars['Int']>,
  courseCount?: Maybe<Scalars['Int']>,
};

export type SchoolTypeObjectType = {
   __typename?: 'SchoolTypeObjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type SignInMutationInput = {
  usernameOrEmail: Scalars['String'],
  password: Scalars['String'],
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type SignInMutationPayload = {
   __typename?: 'SignInMutationPayload',
  user?: Maybe<UserType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  token?: Maybe<Scalars['String']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type SignUpMutationInput = {
  username: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String'],
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type SignUpMutationPayload = {
   __typename?: 'SignUpMutationPayload',
  user?: Maybe<UserType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type SubjectType = {
   __typename?: 'SubjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type UpdateCommentMutationInput = {
  text: Scalars['String'],
  attachment?: Maybe<Scalars['String']>,
  commentId: Scalars['Int'],
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UpdateCommentMutationPayload = {
   __typename?: 'UpdateCommentMutationPayload',
  comment?: Maybe<CommentType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UpdateUserMutationInput = {
  username: Scalars['String'],
  email: Scalars['String'],
  title?: Maybe<Scalars['String']>,
  bio?: Maybe<Scalars['String']>,
  avatar?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UpdateUserMutationPayload = {
   __typename?: 'UpdateUserMutationPayload',
  user?: Maybe<UserType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UploadResourceMutationInput = {
  title: Scalars['String'],
  resourceType: Scalars['ID'],
  files: Scalars['String'],
  course: Scalars['ID'],
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UploadResourceMutationPayload = {
   __typename?: 'UploadResourceMutationPayload',
  resource?: Maybe<ResourceType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UpvoteCommentMutation = {
   __typename?: 'UpvoteCommentMutation',
  comment?: Maybe<CommentType>,
};

export type UpvoteCourseMutation = {
   __typename?: 'UpvoteCourseMutation',
  course?: Maybe<CourseType>,
};

export type UpvoteResourceMutation = {
   __typename?: 'UpvoteResourceMutation',
  resource?: Maybe<ResourceType>,
};

export type UserType = {
   __typename?: 'UserType',
  id: Scalars['ID'],
  username: Scalars['String'],
  title?: Maybe<Scalars['String']>,
  bio?: Maybe<Scalars['String']>,
  avatar?: Maybe<Scalars['String']>,
  created: Scalars['DateTime'],
  createdCourses: Array<CourseType>,
  createdResources: Array<ResourceType>,
  email?: Maybe<Scalars['String']>,
  avatarThumbnail?: Maybe<Scalars['String']>,
  points?: Maybe<Scalars['Int']>,
  courseCount?: Maybe<Scalars['Int']>,
  resourceCount?: Maybe<Scalars['Int']>,
};

export type SignUpMutationVariables = {
  username: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String']
};


export type SignUpMutation = (
  { __typename?: 'Mutation' }
  & { signUp: Maybe<(
    { __typename?: 'SignUpMutationPayload' }
    & { user: Maybe<(
      { __typename?: 'UserType' }
      & Pick<UserType, 'id' | 'created'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )>, signIn: Maybe<(
    { __typename?: 'SignInMutationPayload' }
    & Pick<SignInMutationPayload, 'token'>
    & { user: Maybe<(
      { __typename?: 'UserType' }
      & Pick<UserType, 'id' | 'title' | 'bio' | 'avatar' | 'points' | 'created' | 'email'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type SignInMutationVariables = {
  usernameOrEmail: Scalars['String'],
  password: Scalars['String']
};


export type SignInMutation = (
  { __typename?: 'Mutation' }
  & { signIn: Maybe<(
    { __typename?: 'SignInMutationPayload' }
    & Pick<SignInMutationPayload, 'token'>
    & { user: Maybe<(
      { __typename?: 'UserType' }
      & Pick<UserType, 'id' | 'title' | 'bio' | 'avatar' | 'points' | 'created' | 'email'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type UserMeQueryVariables = {};


export type UserMeQuery = (
  { __typename?: 'Query' }
  & { userMe: Maybe<(
    { __typename?: 'UserType' }
    & Pick<UserType, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'points' | 'courseCount' | 'resourceCount' | 'created'>
  )> }
);

export type ChangePasswordMutationVariables = {
  oldPassword: Scalars['String'],
  newPassword: Scalars['String']
};


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: Maybe<(
    { __typename?: 'ChangePasswordMutationPayload' }
    & { errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type DeleteAccountMutationVariables = {
  password: Scalars['String']
};


export type DeleteAccountMutation = (
  { __typename?: 'Mutation' }
  & { deleteUser: Maybe<(
    { __typename?: 'DeleteUserMutationPayload' }
    & { errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type SchoolsQueryVariables = {};


export type SchoolsQuery = (
  { __typename?: 'Query' }
  & { schools: Maybe<Array<Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'id' | 'name'>
  )>>> }
);

export type SchoolTypesQueryVariables = {};


export type SchoolTypesQuery = (
  { __typename?: 'Query' }
  & { schoolTypes: Maybe<Array<Maybe<(
    { __typename?: 'SchoolTypeObjectType' }
    & Pick<SchoolTypeObjectType, 'id' | 'name'>
  )>>> }
);

export type CoursesQueryVariables = {};


export type CoursesQuery = (
  { __typename?: 'Query' }
  & { courses: Maybe<Array<Maybe<(
    { __typename?: 'CourseType' }
    & Pick<CourseType, 'id' | 'name'>
  )>>> }
);

export type SubjectsQueryVariables = {};


export type SubjectsQuery = (
  { __typename?: 'Query' }
  & { subjects: Maybe<Array<Maybe<(
    { __typename?: 'SubjectType' }
    & Pick<SubjectType, 'id' | 'name'>
  )>>> }
);

export type CountriesQueryVariables = {};


export type CountriesQuery = (
  { __typename?: 'Query' }
  & { countries: Maybe<Array<Maybe<(
    { __typename?: 'CountryType' }
    & Pick<CountryType, 'id' | 'name'>
  )>>> }
);

export type CitiesQueryVariables = {};


export type CitiesQuery = (
  { __typename?: 'Query' }
  & { cities: Maybe<Array<Maybe<(
    { __typename?: 'CityType' }
    & Pick<CityType, 'id' | 'name'>
  )>>> }
);

export type ResourceTypesQueryVariables = {};


export type ResourceTypesQuery = (
  { __typename?: 'Query' }
  & { resourceTypes: Maybe<Array<Maybe<(
    { __typename?: 'ResourceTypeObjectType' }
    & Pick<ResourceTypeObjectType, 'id' | 'name'>
  )>>> }
);

export type CourseDetailQueryVariables = {
  courseId: Scalars['Int']
};


export type CourseDetailQuery = (
  { __typename?: 'Query' }
  & { course: Maybe<(
    { __typename?: 'CourseType' }
    & Pick<CourseType, 'id' | 'name' | 'code' | 'modified' | 'created' | 'points' | 'resourceCount'>
    & { subject: (
      { __typename?: 'SubjectType' }
      & Pick<SubjectType, 'id' | 'name'>
    ), school: (
      { __typename?: 'SchoolType' }
      & Pick<SchoolType, 'id' | 'name'>
    ), creator: Maybe<(
      { __typename?: 'UserType' }
      & Pick<UserType, 'id' | 'username'>
    )>, resources: Array<(
      { __typename?: 'ResourceType' }
      & Pick<ResourceType, 'id' | 'title' | 'points'>
    )> }
  )> }
);

export type CreateCourseMutationVariables = {
  courseName: Scalars['String'],
  courseCode?: Maybe<Scalars['String']>,
  subject: Scalars['ID'],
  school: Scalars['ID']
};


export type CreateCourseMutation = (
  { __typename?: 'Mutation' }
  & { createCourse: Maybe<(
    { __typename?: 'CreateCourseMutationPayload' }
    & { course: Maybe<(
      { __typename?: 'CourseType' }
      & Pick<CourseType, 'id'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type ResourceDetailQueryVariables = {
  id: Scalars['Int']
};


export type ResourceDetailQuery = (
  { __typename?: 'Query' }
  & { resource: Maybe<(
    { __typename?: 'ResourceType' }
    & Pick<ResourceType, 'id' | 'resourceType' | 'title' | 'file' | 'date' | 'created' | 'modified' | 'points'>
    & { creator: Maybe<(
      { __typename?: 'UserType' }
      & Pick<UserType, 'id'>
    )>, resourceParts: Array<(
      { __typename?: 'ResourcePartType' }
      & Pick<ResourcePartType, 'id' | 'title' | 'file' | 'text'>
    )> }
  )> }
);

export type SchoolDetailQueryVariables = {
  id: Scalars['Int']
};


export type SchoolDetailQuery = (
  { __typename?: 'Query' }
  & { school: Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'id' | 'name' | 'city' | 'country' | 'schoolType' | 'subjectCount' | 'courseCount'>
  )> }
);

export type SearchCoursesQueryVariables = {
  courseName?: Maybe<Scalars['String']>,
  courseCode?: Maybe<Scalars['String']>,
  school?: Maybe<Scalars['Int']>,
  subject?: Maybe<Scalars['Int']>,
  schoolType?: Maybe<Scalars['Int']>,
  country?: Maybe<Scalars['Int']>,
  city?: Maybe<Scalars['Int']>
};


export type SearchCoursesQuery = (
  { __typename?: 'Query' }
  & { courses: Maybe<Array<Maybe<(
    { __typename?: 'CourseType' }
    & Pick<CourseType, 'id' | 'name' | 'code'>
  )>>>, school: Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'id' | 'name'>
  )>, subject: Maybe<(
    { __typename?: 'SubjectType' }
    & Pick<SubjectType, 'id' | 'name'>
  )>, schoolType: Maybe<(
    { __typename?: 'SchoolTypeObjectType' }
    & Pick<SchoolTypeObjectType, 'id' | 'name'>
  )>, country: Maybe<(
    { __typename?: 'CountryType' }
    & Pick<CountryType, 'id' | 'name'>
  )>, city: Maybe<(
    { __typename?: 'CityType' }
    & Pick<CityType, 'id' | 'name'>
  )> }
);

export type UploadResourceInitialDataQueryVariables = {
  course?: Maybe<Scalars['Int']>
};


export type UploadResourceInitialDataQuery = (
  { __typename?: 'Query' }
  & { course: Maybe<(
    { __typename?: 'CourseType' }
    & Pick<CourseType, 'id' | 'name'>
  )> }
);

export type UploadResourceMutationVariables = {
  title: Scalars['String'],
  resourceType: Scalars['ID'],
  course: Scalars['ID'],
  files: Scalars['String']
};


export type UploadResourceMutation = (
  { __typename?: 'Mutation' }
  & { uploadResource: Maybe<(
    { __typename?: 'UploadResourceMutationPayload' }
    & { errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type UsersQueryVariables = {};


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Maybe<Array<Maybe<(
    { __typename?: 'UserType' }
    & Pick<UserType, 'id' | 'username' | 'points' | 'avatarThumbnail'>
  )>>> }
);

export type UserDetailQueryVariables = {
  id: Scalars['Int']
};


export type UserDetailQuery = (
  { __typename?: 'Query' }
  & { user: Maybe<(
    { __typename?: 'UserType' }
    & Pick<UserType, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'points' | 'courseCount' | 'resourceCount' | 'created'>
  )> }
);

export type UpdateUserMutationVariables = {
  username: Scalars['String'],
  email: Scalars['String'],
  title?: Maybe<Scalars['String']>,
  bio?: Maybe<Scalars['String']>,
  avatar?: Maybe<Scalars['String']>
};


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: Maybe<(
    { __typename?: 'UpdateUserMutationPayload' }
    & { user: Maybe<(
      { __typename?: 'UserType' }
      & Pick<UserType, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'points' | 'created'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);


export const SignUpDocument = gql`
    mutation SignUp($username: String!, $email: String!, $password: String!) {
  signUp(input: {username: $username, email: $email, password: $password}) {
    user {
      id
      created
    }
    errors {
      field
      messages
    }
  }
  signIn(input: {usernameOrEmail: $email, password: $password}) {
    token
    user {
      id
      title
      bio
      avatar
      points
      created
      email
    }
    errors {
      field
      messages
    }
  }
}
    `;
export type SignUpMutationFn = ApolloReactCommon.MutationFunction<SignUpMutation, SignUpMutationVariables>;

    export function useSignUpMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
      return ApolloReactHooks.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, baseOptions);
    }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = ApolloReactCommon.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = ApolloReactCommon.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const SignInDocument = gql`
    mutation SignIn($usernameOrEmail: String!, $password: String!) {
  signIn(input: {usernameOrEmail: $usernameOrEmail, password: $password}) {
    token
    user {
      id
      title
      bio
      avatar
      points
      created
      email
    }
    errors {
      field
      messages
    }
  }
}
    `;
export type SignInMutationFn = ApolloReactCommon.MutationFunction<SignInMutation, SignInMutationVariables>;

    export function useSignInMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
      return ApolloReactHooks.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, baseOptions);
    }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = ApolloReactCommon.MutationResult<SignInMutation>;
export type SignInMutationOptions = ApolloReactCommon.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const UserMeDocument = gql`
    query UserMe {
  userMe {
    id
    username
    email
    title
    bio
    avatar
    points
    courseCount
    resourceCount
    created
  }
}
    `;

    export function useUserMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserMeQuery, UserMeQueryVariables>) {
      return ApolloReactHooks.useQuery<UserMeQuery, UserMeQueryVariables>(UserMeDocument, baseOptions);
    }
      export function useUserMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserMeQuery, UserMeQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<UserMeQuery, UserMeQueryVariables>(UserMeDocument, baseOptions);
      }
      
export type UserMeQueryHookResult = ReturnType<typeof useUserMeQuery>;
export type UserMeQueryResult = ApolloReactCommon.QueryResult<UserMeQuery, UserMeQueryVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
  changePassword(input: {oldPassword: $oldPassword, newPassword: $newPassword}) {
    errors {
      field
      messages
    }
  }
}
    `;
export type ChangePasswordMutationFn = ApolloReactCommon.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

    export function useChangePasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
      return ApolloReactHooks.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, baseOptions);
    }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = ApolloReactCommon.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const DeleteAccountDocument = gql`
    mutation DeleteAccount($password: String!) {
  deleteUser(input: {password: $password}) {
    errors {
      field
      messages
    }
  }
}
    `;
export type DeleteAccountMutationFn = ApolloReactCommon.MutationFunction<DeleteAccountMutation, DeleteAccountMutationVariables>;

    export function useDeleteAccountMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>) {
      return ApolloReactHooks.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, baseOptions);
    }
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>;
export type DeleteAccountMutationResult = ApolloReactCommon.MutationResult<DeleteAccountMutation>;
export type DeleteAccountMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const SchoolsDocument = gql`
    query Schools {
  schools {
    id
    name
  }
}
    `;

    export function useSchoolsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SchoolsQuery, SchoolsQueryVariables>) {
      return ApolloReactHooks.useQuery<SchoolsQuery, SchoolsQueryVariables>(SchoolsDocument, baseOptions);
    }
      export function useSchoolsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SchoolsQuery, SchoolsQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<SchoolsQuery, SchoolsQueryVariables>(SchoolsDocument, baseOptions);
      }
      
export type SchoolsQueryHookResult = ReturnType<typeof useSchoolsQuery>;
export type SchoolsQueryResult = ApolloReactCommon.QueryResult<SchoolsQuery, SchoolsQueryVariables>;
export const SchoolTypesDocument = gql`
    query SchoolTypes {
  schoolTypes {
    id
    name
  }
}
    `;

    export function useSchoolTypesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SchoolTypesQuery, SchoolTypesQueryVariables>) {
      return ApolloReactHooks.useQuery<SchoolTypesQuery, SchoolTypesQueryVariables>(SchoolTypesDocument, baseOptions);
    }
      export function useSchoolTypesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SchoolTypesQuery, SchoolTypesQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<SchoolTypesQuery, SchoolTypesQueryVariables>(SchoolTypesDocument, baseOptions);
      }
      
export type SchoolTypesQueryHookResult = ReturnType<typeof useSchoolTypesQuery>;
export type SchoolTypesQueryResult = ApolloReactCommon.QueryResult<SchoolTypesQuery, SchoolTypesQueryVariables>;
export const CoursesDocument = gql`
    query Courses {
  courses {
    id
    name
  }
}
    `;

    export function useCoursesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CoursesQuery, CoursesQueryVariables>) {
      return ApolloReactHooks.useQuery<CoursesQuery, CoursesQueryVariables>(CoursesDocument, baseOptions);
    }
      export function useCoursesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CoursesQuery, CoursesQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<CoursesQuery, CoursesQueryVariables>(CoursesDocument, baseOptions);
      }
      
export type CoursesQueryHookResult = ReturnType<typeof useCoursesQuery>;
export type CoursesQueryResult = ApolloReactCommon.QueryResult<CoursesQuery, CoursesQueryVariables>;
export const SubjectsDocument = gql`
    query Subjects {
  subjects {
    id
    name
  }
}
    `;

    export function useSubjectsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SubjectsQuery, SubjectsQueryVariables>) {
      return ApolloReactHooks.useQuery<SubjectsQuery, SubjectsQueryVariables>(SubjectsDocument, baseOptions);
    }
      export function useSubjectsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SubjectsQuery, SubjectsQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<SubjectsQuery, SubjectsQueryVariables>(SubjectsDocument, baseOptions);
      }
      
export type SubjectsQueryHookResult = ReturnType<typeof useSubjectsQuery>;
export type SubjectsQueryResult = ApolloReactCommon.QueryResult<SubjectsQuery, SubjectsQueryVariables>;
export const CountriesDocument = gql`
    query Countries {
  countries {
    id
    name
  }
}
    `;

    export function useCountriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CountriesQuery, CountriesQueryVariables>) {
      return ApolloReactHooks.useQuery<CountriesQuery, CountriesQueryVariables>(CountriesDocument, baseOptions);
    }
      export function useCountriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CountriesQuery, CountriesQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<CountriesQuery, CountriesQueryVariables>(CountriesDocument, baseOptions);
      }
      
export type CountriesQueryHookResult = ReturnType<typeof useCountriesQuery>;
export type CountriesQueryResult = ApolloReactCommon.QueryResult<CountriesQuery, CountriesQueryVariables>;
export const CitiesDocument = gql`
    query Cities {
  cities {
    id
    name
  }
}
    `;

    export function useCitiesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CitiesQuery, CitiesQueryVariables>) {
      return ApolloReactHooks.useQuery<CitiesQuery, CitiesQueryVariables>(CitiesDocument, baseOptions);
    }
      export function useCitiesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CitiesQuery, CitiesQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<CitiesQuery, CitiesQueryVariables>(CitiesDocument, baseOptions);
      }
      
export type CitiesQueryHookResult = ReturnType<typeof useCitiesQuery>;
export type CitiesQueryResult = ApolloReactCommon.QueryResult<CitiesQuery, CitiesQueryVariables>;
export const ResourceTypesDocument = gql`
    query ResourceTypes {
  resourceTypes {
    id
    name
  }
}
    `;

    export function useResourceTypesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ResourceTypesQuery, ResourceTypesQueryVariables>) {
      return ApolloReactHooks.useQuery<ResourceTypesQuery, ResourceTypesQueryVariables>(ResourceTypesDocument, baseOptions);
    }
      export function useResourceTypesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ResourceTypesQuery, ResourceTypesQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<ResourceTypesQuery, ResourceTypesQueryVariables>(ResourceTypesDocument, baseOptions);
      }
      
export type ResourceTypesQueryHookResult = ReturnType<typeof useResourceTypesQuery>;
export type ResourceTypesQueryResult = ApolloReactCommon.QueryResult<ResourceTypesQuery, ResourceTypesQueryVariables>;
export const CourseDetailDocument = gql`
    query CourseDetail($courseId: Int!) {
  course(courseId: $courseId) {
    id
    name
    code
    subject {
      id
      name
    }
    school {
      id
      name
    }
    creator {
      id
      username
    }
    resources {
      id
      title
      points
    }
    modified
    created
    points
    resourceCount
  }
}
    `;

    export function useCourseDetailQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CourseDetailQuery, CourseDetailQueryVariables>) {
      return ApolloReactHooks.useQuery<CourseDetailQuery, CourseDetailQueryVariables>(CourseDetailDocument, baseOptions);
    }
      export function useCourseDetailLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CourseDetailQuery, CourseDetailQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<CourseDetailQuery, CourseDetailQueryVariables>(CourseDetailDocument, baseOptions);
      }
      
export type CourseDetailQueryHookResult = ReturnType<typeof useCourseDetailQuery>;
export type CourseDetailQueryResult = ApolloReactCommon.QueryResult<CourseDetailQuery, CourseDetailQueryVariables>;
export const CreateCourseDocument = gql`
    mutation CreateCourse($courseName: String!, $courseCode: String, $subject: ID!, $school: ID!) {
  createCourse(input: {name: $courseName, code: $courseCode, subject: $subject, school: $school}) {
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
export type CreateCourseMutationFn = ApolloReactCommon.MutationFunction<CreateCourseMutation, CreateCourseMutationVariables>;

    export function useCreateCourseMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCourseMutation, CreateCourseMutationVariables>) {
      return ApolloReactHooks.useMutation<CreateCourseMutation, CreateCourseMutationVariables>(CreateCourseDocument, baseOptions);
    }
export type CreateCourseMutationHookResult = ReturnType<typeof useCreateCourseMutation>;
export type CreateCourseMutationResult = ApolloReactCommon.MutationResult<CreateCourseMutation>;
export type CreateCourseMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateCourseMutation, CreateCourseMutationVariables>;
export const ResourceDetailDocument = gql`
    query ResourceDetail($id: Int!) {
  resource(resourceId: $id) {
    id
    resourceType
    title
    file
    date
    created
    creator {
      id
    }
    modified
    created
    points
    resourceParts {
      id
      title
      file
      text
    }
  }
}
    `;

    export function useResourceDetailQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ResourceDetailQuery, ResourceDetailQueryVariables>) {
      return ApolloReactHooks.useQuery<ResourceDetailQuery, ResourceDetailQueryVariables>(ResourceDetailDocument, baseOptions);
    }
      export function useResourceDetailLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ResourceDetailQuery, ResourceDetailQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<ResourceDetailQuery, ResourceDetailQueryVariables>(ResourceDetailDocument, baseOptions);
      }
      
export type ResourceDetailQueryHookResult = ReturnType<typeof useResourceDetailQuery>;
export type ResourceDetailQueryResult = ApolloReactCommon.QueryResult<ResourceDetailQuery, ResourceDetailQueryVariables>;
export const SchoolDetailDocument = gql`
    query SchoolDetail($id: Int!) {
  school(schoolId: $id) {
    id
    name
    city
    country
    schoolType
    subjectCount
    courseCount
  }
}
    `;

    export function useSchoolDetailQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SchoolDetailQuery, SchoolDetailQueryVariables>) {
      return ApolloReactHooks.useQuery<SchoolDetailQuery, SchoolDetailQueryVariables>(SchoolDetailDocument, baseOptions);
    }
      export function useSchoolDetailLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SchoolDetailQuery, SchoolDetailQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<SchoolDetailQuery, SchoolDetailQueryVariables>(SchoolDetailDocument, baseOptions);
      }
      
export type SchoolDetailQueryHookResult = ReturnType<typeof useSchoolDetailQuery>;
export type SchoolDetailQueryResult = ApolloReactCommon.QueryResult<SchoolDetailQuery, SchoolDetailQueryVariables>;
export const SearchCoursesDocument = gql`
    query SearchCourses($courseName: String, $courseCode: String, $school: Int, $subject: Int, $schoolType: Int, $country: Int, $city: Int) {
  courses(courseName: $courseName, courseCode: $courseCode, schoolId: $school, subjectId: $subject, schoolTypeId: $schoolType, countryId: $country, cityId: $city) {
    id
    name
    code
  }
  school(schoolId: $school) {
    id
    name
  }
  subject(subjectId: $subject) {
    id
    name
  }
  schoolType(schoolTypeId: $schoolType) {
    id
    name
  }
  country(countryId: $country) {
    id
    name
  }
  city(cityId: $city) {
    id
    name
  }
}
    `;

    export function useSearchCoursesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchCoursesQuery, SearchCoursesQueryVariables>) {
      return ApolloReactHooks.useQuery<SearchCoursesQuery, SearchCoursesQueryVariables>(SearchCoursesDocument, baseOptions);
    }
      export function useSearchCoursesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchCoursesQuery, SearchCoursesQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<SearchCoursesQuery, SearchCoursesQueryVariables>(SearchCoursesDocument, baseOptions);
      }
      
export type SearchCoursesQueryHookResult = ReturnType<typeof useSearchCoursesQuery>;
export type SearchCoursesQueryResult = ApolloReactCommon.QueryResult<SearchCoursesQuery, SearchCoursesQueryVariables>;
export const UploadResourceInitialDataDocument = gql`
    query UploadResourceInitialData($course: Int) {
  course(courseId: $course) {
    id
    name
  }
}
    `;

    export function useUploadResourceInitialDataQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UploadResourceInitialDataQuery, UploadResourceInitialDataQueryVariables>) {
      return ApolloReactHooks.useQuery<UploadResourceInitialDataQuery, UploadResourceInitialDataQueryVariables>(UploadResourceInitialDataDocument, baseOptions);
    }
      export function useUploadResourceInitialDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UploadResourceInitialDataQuery, UploadResourceInitialDataQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<UploadResourceInitialDataQuery, UploadResourceInitialDataQueryVariables>(UploadResourceInitialDataDocument, baseOptions);
      }
      
export type UploadResourceInitialDataQueryHookResult = ReturnType<typeof useUploadResourceInitialDataQuery>;
export type UploadResourceInitialDataQueryResult = ApolloReactCommon.QueryResult<UploadResourceInitialDataQuery, UploadResourceInitialDataQueryVariables>;
export const UploadResourceDocument = gql`
    mutation UploadResource($title: String!, $resourceType: ID!, $course: ID!, $files: String!) {
  uploadResource(input: {title: $title, resourceType: $resourceType, course: $course, files: $files}) {
    errors {
      field
      messages
    }
  }
}
    `;
export type UploadResourceMutationFn = ApolloReactCommon.MutationFunction<UploadResourceMutation, UploadResourceMutationVariables>;

    export function useUploadResourceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UploadResourceMutation, UploadResourceMutationVariables>) {
      return ApolloReactHooks.useMutation<UploadResourceMutation, UploadResourceMutationVariables>(UploadResourceDocument, baseOptions);
    }
export type UploadResourceMutationHookResult = ReturnType<typeof useUploadResourceMutation>;
export type UploadResourceMutationResult = ApolloReactCommon.MutationResult<UploadResourceMutation>;
export type UploadResourceMutationOptions = ApolloReactCommon.BaseMutationOptions<UploadResourceMutation, UploadResourceMutationVariables>;
export const UsersDocument = gql`
    query Users {
  users {
    id
    username
    points
    avatarThumbnail
  }
}
    `;

    export function useUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
      return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
    }
      export function useUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      }
      
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersQueryResult = ApolloReactCommon.QueryResult<UsersQuery, UsersQueryVariables>;
export const UserDetailDocument = gql`
    query UserDetail($id: Int!) {
  user(userId: $id) {
    id
    username
    email
    title
    bio
    avatar
    points
    courseCount
    resourceCount
    created
  }
}
    `;

    export function useUserDetailQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserDetailQuery, UserDetailQueryVariables>) {
      return ApolloReactHooks.useQuery<UserDetailQuery, UserDetailQueryVariables>(UserDetailDocument, baseOptions);
    }
      export function useUserDetailLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserDetailQuery, UserDetailQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<UserDetailQuery, UserDetailQueryVariables>(UserDetailDocument, baseOptions);
      }
      
export type UserDetailQueryHookResult = ReturnType<typeof useUserDetailQuery>;
export type UserDetailQueryResult = ApolloReactCommon.QueryResult<UserDetailQuery, UserDetailQueryVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($username: String!, $email: String!, $title: String, $bio: String, $avatar: String) {
  updateUser(input: {username: $username, email: $email, title: $title, bio: $bio, avatar: $avatar}) {
    user {
      id
      username
      email
      title
      bio
      avatar
      points
      created
    }
    errors {
      field
      messages
    }
  }
}
    `;
export type UpdateUserMutationFn = ApolloReactCommon.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

    export function useUpdateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
      return ApolloReactHooks.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, baseOptions);
    }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = ApolloReactCommon.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;