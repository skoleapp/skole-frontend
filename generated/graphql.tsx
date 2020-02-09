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
  DateTime: any,
  Date: any,
};

export type ChangePasswordMutationInput = {
  oldPassword: Scalars['String'],
  newPassword: Scalars['String'],
  clientMutationId?: Maybe<Scalars['String']>,
};

export type ChangePasswordMutationPayload = {
   __typename?: 'ChangePasswordMutationPayload',
  user?: Maybe<UserObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CityObjectType = {
   __typename?: 'CityObjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type CommentObjectType = {
   __typename?: 'CommentObjectType',
  id?: Maybe<Scalars['Int']>,
  user?: Maybe<UserObjectType>,
  text: Scalars['String'],
  attachment: Scalars['String'],
  course?: Maybe<CourseObjectType>,
  resource?: Maybe<ResourceObjectType>,
  resourcePart?: Maybe<ResourcePartObjectType>,
  comment?: Maybe<CommentObjectType>,
  modified: Scalars['DateTime'],
  created: Scalars['DateTime'],
  replyComments: Array<CommentObjectType>,
  points?: Maybe<Scalars['Int']>,
  replyCount?: Maybe<Scalars['Int']>,
  voteStatus?: Maybe<Scalars['Int']>,
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

export type CountryObjectType = {
   __typename?: 'CountryObjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type CourseObjectType = {
   __typename?: 'CourseObjectType',
  id?: Maybe<Scalars['Int']>,
  name: Scalars['String'],
  code: Scalars['String'],
  subject?: Maybe<SubjectObjectType>,
  school: SchoolObjectType,
  user?: Maybe<UserObjectType>,
  modified: Scalars['DateTime'],
  created: Scalars['DateTime'],
  resources: Array<ResourceObjectType>,
  comments: Array<CommentObjectType>,
  points?: Maybe<Scalars['Int']>,
  resourceCount?: Maybe<Scalars['Int']>,
};

export type CreateCommentMutationInput = {
  text: Scalars['String'],
  attachment?: Maybe<Scalars['String']>,
  courseId?: Maybe<Scalars['Int']>,
  resourceId?: Maybe<Scalars['Int']>,
  resourcePartId?: Maybe<Scalars['Int']>,
  commentId?: Maybe<Scalars['Int']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CreateCommentMutationPayload = {
   __typename?: 'CreateCommentMutationPayload',
  comment?: Maybe<CommentObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CreateCourseMutationInput = {
  name: Scalars['String'],
  code?: Maybe<Scalars['String']>,
  subjectId?: Maybe<Scalars['Int']>,
  schoolId: Scalars['Int'],
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CreateCourseMutationPayload = {
   __typename?: 'CreateCourseMutationPayload',
  course?: Maybe<CourseObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CreateResourceMutationInput = {
  title: Scalars['String'],
  resourceTypeId: Scalars['Int'],
  courseId: Scalars['Int'],
  date?: Maybe<Scalars['Date']>,
  files?: Maybe<Scalars['String']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CreateResourceMutationPayload = {
   __typename?: 'CreateResourceMutationPayload',
  resource?: Maybe<ResourceObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CreateVoteMutationInput = {
  status: Scalars['Int'],
  commentId?: Maybe<Scalars['Int']>,
  courseId?: Maybe<Scalars['Int']>,
  resourceId?: Maybe<Scalars['Int']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CreateVoteMutationPayload = {
   __typename?: 'CreateVoteMutationPayload',
  message?: Maybe<Scalars['String']>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};



export type DeleteObjectMutation = {
   __typename?: 'DeleteObjectMutation',
  message?: Maybe<Scalars['String']>,
};

export type DeleteUserMutationInput = {
  password: Scalars['String'],
  clientMutationId?: Maybe<Scalars['String']>,
};

export type DeleteUserMutationPayload = {
   __typename?: 'DeleteUserMutationPayload',
  message?: Maybe<Scalars['String']>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type ErrorType = {
   __typename?: 'ErrorType',
  field: Scalars['String'],
  messages: Array<Scalars['String']>,
};

export type LoginMutationInput = {
  usernameOrEmail: Scalars['String'],
  password: Scalars['String'],
  clientMutationId?: Maybe<Scalars['String']>,
};

export type LoginMutationPayload = {
   __typename?: 'LoginMutationPayload',
  user?: Maybe<UserObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  token?: Maybe<Scalars['String']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type Mutation = {
   __typename?: 'Mutation',
  createVote?: Maybe<CreateVoteMutationPayload>,
  login?: Maybe<LoginMutationPayload>,
  register?: Maybe<RegisterMutationPayload>,
  updateUser?: Maybe<UpdateUserMutationPayload>,
  changePassword?: Maybe<ChangePasswordMutationPayload>,
  deleteUser?: Maybe<DeleteUserMutationPayload>,
  uploadResource?: Maybe<CreateResourceMutationPayload>,
  updateResource?: Maybe<UpdateResourceMutationPayload>,
  deleteObject?: Maybe<DeleteObjectMutation>,
  createCourse?: Maybe<CreateCourseMutationPayload>,
  contact?: Maybe<ContactMutationPayload>,
  createComment?: Maybe<CreateCommentMutationPayload>,
  updateComment?: Maybe<UpdateCommentMutationPayload>,
};


export type MutationCreateVoteArgs = {
  input: CreateVoteMutationInput
};


export type MutationLoginArgs = {
  input: LoginMutationInput
};


export type MutationRegisterArgs = {
  input: RegisterMutationInput
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


export type MutationUploadResourceArgs = {
  input: CreateResourceMutationInput
};


export type MutationUpdateResourceArgs = {
  input: UpdateResourceMutationInput
};


export type MutationDeleteObjectArgs = {
  comment?: Maybe<Scalars['Int']>,
  resource?: Maybe<Scalars['Int']>,
  resourcePart?: Maybe<Scalars['Int']>,
  vote?: Maybe<Scalars['Int']>
};


export type MutationCreateCourseArgs = {
  input: CreateCourseMutationInput
};


export type MutationContactArgs = {
  input: ContactMutationInput
};


export type MutationCreateCommentArgs = {
  input: CreateCommentMutationInput
};


export type MutationUpdateCommentArgs = {
  input: UpdateCommentMutationInput
};

export type Query = {
   __typename?: 'Query',
  users?: Maybe<Array<Maybe<UserObjectType>>>,
  user?: Maybe<UserObjectType>,
  userMe?: Maybe<UserObjectType>,
  subjects?: Maybe<Array<Maybe<SubjectObjectType>>>,
  subject?: Maybe<SubjectObjectType>,
  schoolTypes?: Maybe<Array<Maybe<SchoolTypeObjectType>>>,
  schoolType?: Maybe<SchoolTypeObjectType>,
  schools?: Maybe<Array<Maybe<SchoolObjectType>>>,
  school?: Maybe<SchoolObjectType>,
  resourceTypes?: Maybe<Array<Maybe<ResourceTypeObjectType>>>,
  resource?: Maybe<ResourceObjectType>,
  courses?: Maybe<Array<Maybe<CourseObjectType>>>,
  course?: Maybe<CourseObjectType>,
  countries?: Maybe<Array<Maybe<CountryObjectType>>>,
  country?: Maybe<CountryObjectType>,
  comment?: Maybe<CommentObjectType>,
  cities?: Maybe<Array<Maybe<CityObjectType>>>,
  city?: Maybe<CityObjectType>,
};


export type QueryUsersArgs = {
  username?: Maybe<Scalars['String']>,
  ordering?: Maybe<Scalars['String']>
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


export type QueryCountryArgs = {
  countryId?: Maybe<Scalars['Int']>
};


export type QueryCommentArgs = {
  commentId?: Maybe<Scalars['Int']>
};


export type QueryCityArgs = {
  cityId?: Maybe<Scalars['Int']>
};

export type RegisterMutationInput = {
  username: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String'],
  clientMutationId?: Maybe<Scalars['String']>,
};

export type RegisterMutationPayload = {
   __typename?: 'RegisterMutationPayload',
  user?: Maybe<UserObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type ResourceObjectType = {
   __typename?: 'ResourceObjectType',
  id?: Maybe<Scalars['Int']>,
  title: Scalars['String'],
  date: Scalars['Date'],
  course: CourseObjectType,
  downloads?: Maybe<Scalars['Int']>,
  user?: Maybe<UserObjectType>,
  modified: Scalars['DateTime'],
  created: Scalars['DateTime'],
  resourceParts: Array<ResourcePartObjectType>,
  comments: Array<CommentObjectType>,
  resourceType?: Maybe<Scalars['String']>,
  points?: Maybe<Scalars['Int']>,
  school?: Maybe<SchoolObjectType>,
};

export type ResourcePartObjectType = {
   __typename?: 'ResourcePartObjectType',
  id: Scalars['ID'],
  title: Scalars['String'],
  file: Scalars['String'],
};

export type ResourceTypeObjectType = {
   __typename?: 'ResourceTypeObjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
  hasParts: Scalars['Boolean'],
};

export type SchoolObjectType = {
   __typename?: 'SchoolObjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
  courses: Array<CourseObjectType>,
  schoolType?: Maybe<Scalars['String']>,
  city?: Maybe<Scalars['String']>,
  country?: Maybe<Scalars['String']>,
  subjects?: Maybe<Array<Maybe<SubjectObjectType>>>,
  subjectCount?: Maybe<Scalars['Int']>,
  courseCount?: Maybe<Scalars['Int']>,
};

export type SchoolTypeObjectType = {
   __typename?: 'SchoolTypeObjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type SubjectObjectType = {
   __typename?: 'SubjectObjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type UpdateCommentMutationInput = {
  commentId: Scalars['Int'],
  text: Scalars['String'],
  attachment?: Maybe<Scalars['String']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UpdateCommentMutationPayload = {
   __typename?: 'UpdateCommentMutationPayload',
  comment?: Maybe<CommentObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UpdateResourceMutationInput = {
  resourceId: Scalars['Int'],
  title: Scalars['String'],
  resourceTypeId: Scalars['Int'],
  date?: Maybe<Scalars['Date']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UpdateResourceMutationPayload = {
   __typename?: 'UpdateResourceMutationPayload',
  resource?: Maybe<ResourceObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UpdateUserMutationInput = {
  username: Scalars['String'],
  email: Scalars['String'],
  title?: Maybe<Scalars['String']>,
  bio?: Maybe<Scalars['String']>,
  avatar?: Maybe<Scalars['String']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UpdateUserMutationPayload = {
   __typename?: 'UpdateUserMutationPayload',
  user?: Maybe<UserObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UserObjectType = {
   __typename?: 'UserObjectType',
  id?: Maybe<Scalars['Int']>,
  username: Scalars['String'],
  title: Scalars['String'],
  bio: Scalars['String'],
  avatar?: Maybe<Scalars['String']>,
  created: Scalars['DateTime'],
  createdCourses: Array<CourseObjectType>,
  createdResources: Array<ResourceObjectType>,
  votes: Array<VoteObjectType>,
  email?: Maybe<Scalars['String']>,
  avatarThumbnail?: Maybe<Scalars['String']>,
  points?: Maybe<Scalars['Int']>,
  courseCount?: Maybe<Scalars['Int']>,
  resourceCount?: Maybe<Scalars['Int']>,
};

export type VoteObjectType = {
   __typename?: 'VoteObjectType',
  id?: Maybe<Scalars['Int']>,
  user: UserObjectType,
  status?: Maybe<Scalars['Int']>,
  comment?: Maybe<CommentObjectType>,
  course?: Maybe<CourseObjectType>,
  resource?: Maybe<ResourceObjectType>,
};

export type RegisterMutationVariables = {
  username: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String']
};


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: Maybe<(
    { __typename?: 'RegisterMutationPayload' }
    & { user: Maybe<(
      { __typename?: 'UserObjectType' }
      & Pick<UserObjectType, 'id' | 'created'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )>, login: Maybe<(
    { __typename?: 'LoginMutationPayload' }
    & Pick<LoginMutationPayload, 'token'>
    & { user: Maybe<(
      { __typename?: 'UserObjectType' }
      & Pick<UserObjectType, 'id' | 'title' | 'bio' | 'avatar' | 'points' | 'created' | 'email'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type LoginMutationVariables = {
  usernameOrEmail: Scalars['String'],
  password: Scalars['String']
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: Maybe<(
    { __typename?: 'LoginMutationPayload' }
    & Pick<LoginMutationPayload, 'token'>
    & { user: Maybe<(
      { __typename?: 'UserObjectType' }
      & Pick<UserObjectType, 'id' | 'title' | 'bio' | 'avatar' | 'points' | 'created' | 'email'>
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
    { __typename?: 'UserObjectType' }
    & Pick<UserObjectType, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'points' | 'courseCount' | 'resourceCount' | 'created'>
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
    { __typename?: 'SchoolObjectType' }
    & Pick<SchoolObjectType, 'id' | 'name'>
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
    { __typename?: 'CourseObjectType' }
    & Pick<CourseObjectType, 'id' | 'name'>
  )>>> }
);

export type SubjectsQueryVariables = {};


export type SubjectsQuery = (
  { __typename?: 'Query' }
  & { subjects: Maybe<Array<Maybe<(
    { __typename?: 'SubjectObjectType' }
    & Pick<SubjectObjectType, 'id' | 'name'>
  )>>> }
);

export type CountriesQueryVariables = {};


export type CountriesQuery = (
  { __typename?: 'Query' }
  & { countries: Maybe<Array<Maybe<(
    { __typename?: 'CountryObjectType' }
    & Pick<CountryObjectType, 'id' | 'name'>
  )>>> }
);

export type CitiesQueryVariables = {};


export type CitiesQuery = (
  { __typename?: 'Query' }
  & { cities: Maybe<Array<Maybe<(
    { __typename?: 'CityObjectType' }
    & Pick<CityObjectType, 'id' | 'name'>
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

export type CreateCommentMutationVariables = {
  text: Scalars['String'],
  attachment?: Maybe<Scalars['String']>,
  courseId?: Maybe<Scalars['Int']>,
  resourceId?: Maybe<Scalars['Int']>,
  resourcePartId?: Maybe<Scalars['Int']>,
  commentId?: Maybe<Scalars['Int']>
};


export type CreateCommentMutation = (
  { __typename?: 'Mutation' }
  & { createComment: Maybe<(
    { __typename?: 'CreateCommentMutationPayload' }
    & { comment: Maybe<(
      { __typename?: 'CommentObjectType' }
      & Pick<CommentObjectType, 'id' | 'text' | 'attachment' | 'modified' | 'created' | 'replyCount' | 'points' | 'voteStatus'>
      & { user: Maybe<(
        { __typename?: 'UserObjectType' }
        & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
      )>, replyComments: Array<(
        { __typename?: 'CommentObjectType' }
        & Pick<CommentObjectType, 'id' | 'text' | 'attachment' | 'modified' | 'created' | 'points' | 'voteStatus'>
        & { user: Maybe<(
          { __typename?: 'UserObjectType' }
          & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
        )> }
      )> }
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type CreateVoteMutationMutationVariables = {
  status: Scalars['Int'],
  commentId?: Maybe<Scalars['Int']>,
  courseId?: Maybe<Scalars['Int']>,
  resourceId?: Maybe<Scalars['Int']>
};


export type CreateVoteMutationMutation = (
  { __typename?: 'Mutation' }
  & { createVote: Maybe<(
    { __typename?: 'CreateVoteMutationPayload' }
    & Pick<CreateVoteMutationPayload, 'message'>
    & { errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type CourseDetailQueryVariables = {
  id: Scalars['Int']
};


export type CourseDetailQuery = (
  { __typename?: 'Query' }
  & { course: Maybe<(
    { __typename?: 'CourseObjectType' }
    & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'modified' | 'created' | 'points' | 'resourceCount'>
    & { subject: Maybe<(
      { __typename?: 'SubjectObjectType' }
      & Pick<SubjectObjectType, 'id' | 'name'>
    )>, school: (
      { __typename?: 'SchoolObjectType' }
      & Pick<SchoolObjectType, 'id' | 'name'>
    ), user: Maybe<(
      { __typename?: 'UserObjectType' }
      & Pick<UserObjectType, 'id' | 'username'>
    )>, resources: Array<(
      { __typename?: 'ResourceObjectType' }
      & Pick<ResourceObjectType, 'id' | 'title' | 'points'>
    )>, comments: Array<(
      { __typename?: 'CommentObjectType' }
      & Pick<CommentObjectType, 'id' | 'text' | 'attachment' | 'modified' | 'created' | 'replyCount' | 'points'>
      & { user: Maybe<(
        { __typename?: 'UserObjectType' }
        & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
      )>, replyComments: Array<(
        { __typename?: 'CommentObjectType' }
        & Pick<CommentObjectType, 'id' | 'text' | 'attachment' | 'modified' | 'created' | 'points'>
        & { user: Maybe<(
          { __typename?: 'UserObjectType' }
          & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
        )> }
      )> }
    )> }
  )> }
);

export type CreateCourseMutationVariables = {
  courseName: Scalars['String'],
  courseCode?: Maybe<Scalars['String']>,
  subjectId: Scalars['Int'],
  schoolId: Scalars['Int']
};


export type CreateCourseMutation = (
  { __typename?: 'Mutation' }
  & { createCourse: Maybe<(
    { __typename?: 'CreateCourseMutationPayload' }
    & { course: Maybe<(
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id'>
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
    { __typename?: 'ResourceObjectType' }
    & Pick<ResourceObjectType, 'id' | 'title' | 'resourceType' | 'date' | 'modified' | 'created' | 'points'>
    & { school: Maybe<(
      { __typename?: 'SchoolObjectType' }
      & Pick<SchoolObjectType, 'id' | 'name'>
    )>, course: (
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id' | 'name'>
    ), user: Maybe<(
      { __typename?: 'UserObjectType' }
      & Pick<UserObjectType, 'id' | 'username'>
    )>, resourceParts: Array<(
      { __typename?: 'ResourcePartObjectType' }
      & Pick<ResourcePartObjectType, 'id' | 'title' | 'file'>
    )> }
  )> }
);

export type SchoolDetailQueryVariables = {
  id: Scalars['Int']
};


export type SchoolDetailQuery = (
  { __typename?: 'Query' }
  & { school: Maybe<(
    { __typename?: 'SchoolObjectType' }
    & Pick<SchoolObjectType, 'id' | 'name' | 'city' | 'country' | 'schoolType' | 'subjectCount' | 'courseCount'>
    & { subjects: Maybe<Array<Maybe<(
      { __typename?: 'SubjectObjectType' }
      & Pick<SubjectObjectType, 'id' | 'name'>
    )>>>, courses: Array<(
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'points'>
    )> }
  )> }
);

export type SearchCoursesQueryVariables = {
  courseName?: Maybe<Scalars['String']>,
  courseCode?: Maybe<Scalars['String']>,
  schoolId?: Maybe<Scalars['Int']>,
  subjectId?: Maybe<Scalars['Int']>,
  schoolTypeId?: Maybe<Scalars['Int']>,
  countryId?: Maybe<Scalars['Int']>,
  cityId?: Maybe<Scalars['Int']>
};


export type SearchCoursesQuery = (
  { __typename?: 'Query' }
  & { courses: Maybe<Array<Maybe<(
    { __typename?: 'CourseObjectType' }
    & Pick<CourseObjectType, 'id' | 'name' | 'code'>
  )>>> }
);

export type UploadResourceInitialDataQueryVariables = {
  course?: Maybe<Scalars['Int']>
};


export type UploadResourceInitialDataQuery = (
  { __typename?: 'Query' }
  & { course: Maybe<(
    { __typename?: 'CourseObjectType' }
    & Pick<CourseObjectType, 'id' | 'name'>
  )> }
);

export type UploadResourceMutationVariables = {
  resourceTitle: Scalars['String'],
  resourceTypeId: Scalars['Int'],
  courseId: Scalars['Int'],
  files: Scalars['String']
};


export type UploadResourceMutation = (
  { __typename?: 'Mutation' }
  & { uploadResource: Maybe<(
    { __typename?: 'CreateResourceMutationPayload' }
    & { resource: Maybe<(
      { __typename?: 'ResourceObjectType' }
      & Pick<ResourceObjectType, 'id'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type UsersQueryVariables = {
  username?: Maybe<Scalars['String']>,
  ordering?: Maybe<Scalars['String']>
};


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Maybe<Array<Maybe<(
    { __typename?: 'UserObjectType' }
    & Pick<UserObjectType, 'id' | 'username' | 'points' | 'avatarThumbnail'>
  )>>> }
);

export type UserDetailQueryVariables = {
  id: Scalars['Int']
};


export type UserDetailQuery = (
  { __typename?: 'Query' }
  & { user: Maybe<(
    { __typename?: 'UserObjectType' }
    & Pick<UserObjectType, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'points' | 'courseCount' | 'resourceCount' | 'created'>
    & { createdCourses: Array<(
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'points'>
    )>, createdResources: Array<(
      { __typename?: 'ResourceObjectType' }
      & Pick<ResourceObjectType, 'id' | 'title' | 'points'>
    )> }
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
      { __typename?: 'UserObjectType' }
      & Pick<UserObjectType, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'points' | 'created'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);


export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
  register(input: {username: $username, email: $email, password: $password}) {
    user {
      id
      created
    }
    errors {
      field
      messages
    }
  }
  login(input: {usernameOrEmail: $email, password: $password}) {
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
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<RegisterMutation, RegisterMutationVariables>;

    export function useRegisterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
      return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
    }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(input: {usernameOrEmail: $usernameOrEmail, password: $password}) {
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
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

    export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
      return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
    }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
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
export const CreateCommentDocument = gql`
    mutation CreateComment($text: String!, $attachment: String, $courseId: Int, $resourceId: Int, $resourcePartId: Int, $commentId: Int) {
  createComment(input: {text: $text, attachment: $attachment, courseId: $courseId, resourceId: $resourceId, resourcePartId: $resourcePartId, commentId: $commentId}) {
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
        points
        voteStatus
      }
      replyCount
      points
      voteStatus
    }
    errors {
      field
      messages
    }
  }
}
    `;
export type CreateCommentMutationFn = ApolloReactCommon.MutationFunction<CreateCommentMutation, CreateCommentMutationVariables>;

    export function useCreateCommentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
      return ApolloReactHooks.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, baseOptions);
    }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = ApolloReactCommon.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
export const CreateVoteMutationDocument = gql`
    mutation CreateVoteMutation($status: Int!, $commentId: Int, $courseId: Int, $resourceId: Int) {
  createVote(input: {status: $status, commentId: $commentId, courseId: $courseId, resourceId: $resourceId}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type CreateVoteMutationMutationFn = ApolloReactCommon.MutationFunction<CreateVoteMutationMutation, CreateVoteMutationMutationVariables>;

    export function useCreateVoteMutationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateVoteMutationMutation, CreateVoteMutationMutationVariables>) {
      return ApolloReactHooks.useMutation<CreateVoteMutationMutation, CreateVoteMutationMutationVariables>(CreateVoteMutationDocument, baseOptions);
    }
export type CreateVoteMutationMutationHookResult = ReturnType<typeof useCreateVoteMutationMutation>;
export type CreateVoteMutationMutationResult = ApolloReactCommon.MutationResult<CreateVoteMutationMutation>;
export type CreateVoteMutationMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateVoteMutationMutation, CreateVoteMutationMutationVariables>;
export const CourseDetailDocument = gql`
    query CourseDetail($id: Int!) {
  course(courseId: $id) {
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
    user {
      id
      username
    }
    resources {
      id
      title
      points
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
        points
      }
      replyCount
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
    mutation CreateCourse($courseName: String!, $courseCode: String, $subjectId: Int!, $schoolId: Int!) {
  createCourse(input: {name: $courseName, code: $courseCode, subjectId: $subjectId, schoolId: $schoolId}) {
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
    title
    resourceType
    date
    modified
    created
    points
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
    resourceParts {
      id
      title
      file
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
    subjects {
      id
      name
    }
    courses {
      id
      name
      code
      points
    }
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
    query SearchCourses($courseName: String, $courseCode: String, $schoolId: Int, $subjectId: Int, $schoolTypeId: Int, $countryId: Int, $cityId: Int) {
  courses(courseName: $courseName, courseCode: $courseCode, schoolId: $schoolId, subjectId: $subjectId, schoolTypeId: $schoolTypeId, countryId: $countryId, cityId: $cityId) {
    id
    name
    code
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
    mutation UploadResource($resourceTitle: String!, $resourceTypeId: Int!, $courseId: Int!, $files: String!) {
  uploadResource(input: {title: $resourceTitle, resourceTypeId: $resourceTypeId, courseId: $courseId, files: $files}) {
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
export type UploadResourceMutationFn = ApolloReactCommon.MutationFunction<UploadResourceMutation, UploadResourceMutationVariables>;

    export function useUploadResourceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UploadResourceMutation, UploadResourceMutationVariables>) {
      return ApolloReactHooks.useMutation<UploadResourceMutation, UploadResourceMutationVariables>(UploadResourceDocument, baseOptions);
    }
export type UploadResourceMutationHookResult = ReturnType<typeof useUploadResourceMutation>;
export type UploadResourceMutationResult = ApolloReactCommon.MutationResult<UploadResourceMutation>;
export type UploadResourceMutationOptions = ApolloReactCommon.BaseMutationOptions<UploadResourceMutation, UploadResourceMutationVariables>;
export const UsersDocument = gql`
    query Users($username: String, $ordering: String) {
  users(username: $username, ordering: $ordering) {
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
    createdCourses {
      id
      name
      code
      points
    }
    createdResources {
      id
      title
      points
    }
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