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
  id: Scalars['ID'],
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
  vote?: Maybe<VoteObjectType>,
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
  id: Scalars['ID'],
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
  course?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>,
  resourcePart?: Maybe<Scalars['ID']>,
  comment?: Maybe<Scalars['ID']>,
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
  subject?: Maybe<Scalars['ID']>,
  school: Scalars['ID'],
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
  resourceType: Scalars['ID'],
  course: Scalars['ID'],
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

export type CreateResourcePartMutationInput = {
  resource: Scalars['ID'],
  resourcePartType: Scalars['ID'],
  title: Scalars['String'],
  file: Scalars['String'],
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CreateResourcePartMutationPayload = {
   __typename?: 'CreateResourcePartMutationPayload',
  resourcePart?: Maybe<ResourcePartObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CreateVoteMutationInput = {
  status: Scalars['String'],
  comment?: Maybe<Scalars['ID']>,
  course?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CreateVoteMutationPayload = {
   __typename?: 'CreateVoteMutationPayload',
  vote?: Maybe<VoteObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};



export type DeleteObjectMutationInput = {
  comment?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>,
  resourcePart?: Maybe<Scalars['ID']>,
  vote?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type DeleteObjectMutationPayload = {
   __typename?: 'DeleteObjectMutationPayload',
  comment?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>,
  resourcePart?: Maybe<Scalars['ID']>,
  vote?: Maybe<Scalars['ID']>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  message?: Maybe<Scalars['String']>,
  clientMutationId?: Maybe<Scalars['String']>,
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
  createResourcePart?: Maybe<CreateResourcePartMutationPayload>,
  updateResourcePart?: Maybe<UpdateResourcePartMutationPayload>,
  uploadResource?: Maybe<CreateResourceMutationPayload>,
  updateResource?: Maybe<UpdateResourceMutationPayload>,
  deleteObject?: Maybe<DeleteObjectMutationPayload>,
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


export type MutationCreateResourcePartArgs = {
  input: CreateResourcePartMutationInput
};


export type MutationUpdateResourcePartArgs = {
  input: UpdateResourcePartMutationInput
};


export type MutationUploadResourceArgs = {
  input: CreateResourceMutationInput
};


export type MutationUpdateResourceArgs = {
  input: UpdateResourceMutationInput
};


export type MutationDeleteObjectArgs = {
  input: DeleteObjectMutationInput
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
  id: Scalars['ID']
};


export type QuerySubjectArgs = {
  id: Scalars['ID']
};


export type QuerySchoolTypeArgs = {
  id: Scalars['ID']
};


export type QuerySchoolArgs = {
  id: Scalars['ID']
};


export type QueryResourceArgs = {
  id: Scalars['ID']
};


export type QueryCoursesArgs = {
  courseName?: Maybe<Scalars['String']>,
  courseCode?: Maybe<Scalars['String']>,
  subject?: Maybe<Scalars['ID']>,
  school?: Maybe<Scalars['ID']>,
  schoolType?: Maybe<Scalars['ID']>,
  country?: Maybe<Scalars['ID']>,
  city?: Maybe<Scalars['ID']>
};


export type QueryCourseArgs = {
  id: Scalars['ID']
};


export type QueryCountryArgs = {
  id: Scalars['ID']
};


export type QueryCommentArgs = {
  id: Scalars['ID']
};


export type QueryCityArgs = {
  id: Scalars['ID']
};

export type RegisterMutationInput = {
  username: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String'],
  code: Scalars['String'],
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
  id: Scalars['ID'],
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
  text: Scalars['String'],
  attachment?: Maybe<Scalars['String']>,
  course?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>,
  resourcePart?: Maybe<Scalars['ID']>,
  comment?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UpdateCommentMutationPayload = {
   __typename?: 'UpdateCommentMutationPayload',
  comment?: Maybe<CommentObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UpdateResourceMutationInput = {
  title: Scalars['String'],
  resourceType: Scalars['ID'],
  date?: Maybe<Scalars['Date']>,
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UpdateResourceMutationPayload = {
   __typename?: 'UpdateResourceMutationPayload',
  resource?: Maybe<ResourceObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UpdateResourcePartMutationInput = {
  resourcePartType: Scalars['ID'],
  title: Scalars['String'],
  file: Scalars['String'],
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UpdateResourcePartMutationPayload = {
   __typename?: 'UpdateResourcePartMutationPayload',
  resourcePart?: Maybe<ResourcePartObjectType>,
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
  id: Scalars['ID'],
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
  id: Scalars['ID'],
  user: UserObjectType,
  status?: Maybe<Scalars['Int']>,
  comment?: Maybe<CommentObjectType>,
  course?: Maybe<CourseObjectType>,
  resource?: Maybe<ResourceObjectType>,
};

export type RegisterMutationVariables = {
  username: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String'],
  code: Scalars['String']
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
  course?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>,
  resourcePart?: Maybe<Scalars['ID']>,
  comment?: Maybe<Scalars['ID']>
};


export type CreateCommentMutation = (
  { __typename?: 'Mutation' }
  & { createComment: Maybe<(
    { __typename?: 'CreateCommentMutationPayload' }
    & { comment: Maybe<(
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
        )>, vote: Maybe<(
          { __typename?: 'VoteObjectType' }
          & Pick<VoteObjectType, 'id' | 'status'>
        )> }
      )>, vote: Maybe<(
        { __typename?: 'VoteObjectType' }
        & Pick<VoteObjectType, 'id' | 'status'>
      )> }
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type CourseDetailQueryVariables = {
  id: Scalars['ID']
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
        )>, vote: Maybe<(
          { __typename?: 'VoteObjectType' }
          & Pick<VoteObjectType, 'id' | 'status'>
        )> }
      )>, vote: Maybe<(
        { __typename?: 'VoteObjectType' }
        & Pick<VoteObjectType, 'id' | 'status'>
      )> }
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
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type DeleteObjectMutationVariables = {
  comment?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>,
  resourcePart?: Maybe<Scalars['ID']>,
  vote?: Maybe<Scalars['ID']>
};


export type DeleteObjectMutation = (
  { __typename?: 'Mutation' }
  & { deleteObject: Maybe<(
    { __typename?: 'DeleteObjectMutationPayload' }
    & Pick<DeleteObjectMutationPayload, 'message'>
    & { errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type ResourceDetailQueryVariables = {
  id: Scalars['ID']
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
  id: Scalars['ID']
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
  school?: Maybe<Scalars['ID']>,
  subject?: Maybe<Scalars['ID']>,
  schoolType?: Maybe<Scalars['ID']>,
  country?: Maybe<Scalars['ID']>,
  city?: Maybe<Scalars['ID']>
};


export type SearchCoursesQuery = (
  { __typename?: 'Query' }
  & { courses: Maybe<Array<Maybe<(
    { __typename?: 'CourseObjectType' }
    & Pick<CourseObjectType, 'id' | 'name' | 'code'>
  )>>> }
);

export type UploadResourceInitialDataQueryVariables = {
  course: Scalars['ID']
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
  resourceType: Scalars['ID'],
  course: Scalars['ID'],
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
  id: Scalars['ID']
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

export type CreateVoteMutationVariables = {
  status: Scalars['String'],
  comment?: Maybe<Scalars['ID']>,
  course?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>
};


export type CreateVoteMutation = (
  { __typename?: 'Mutation' }
  & { createVote: Maybe<(
    { __typename?: 'CreateVoteMutationPayload' }
    & { vote: Maybe<(
      { __typename?: 'VoteObjectType' }
      & Pick<VoteObjectType, 'id' | 'status'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);


export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!, $code: String!) {
  register(input: {username: $username, email: $email, password: $password, code: $code}) {
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
    mutation CreateComment($text: String!, $attachment: String, $course: ID, $resource: ID, $resourcePart: ID, $comment: ID) {
  createComment(input: {text: $text, attachment: $attachment, course: $course, resource: $resource, resourcePart: $resourcePart, comment: $comment}) {
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
        vote {
          id
          status
        }
      }
      replyCount
      points
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
export type CreateCommentMutationFn = ApolloReactCommon.MutationFunction<CreateCommentMutation, CreateCommentMutationVariables>;

    export function useCreateCommentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
      return ApolloReactHooks.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, baseOptions);
    }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = ApolloReactCommon.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
export const CourseDetailDocument = gql`
    query CourseDetail($id: ID!) {
  course(id: $id) {
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
        vote {
          id
          status
        }
      }
      replyCount
      points
      vote {
        id
        status
      }
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
export const DeleteObjectDocument = gql`
    mutation DeleteObject($comment: ID, $resource: ID, $resourcePart: ID, $vote: ID) {
  deleteObject(input: {comment: $comment, resource: $resource, resourcePart: $resourcePart, vote: $vote}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type DeleteObjectMutationFn = ApolloReactCommon.MutationFunction<DeleteObjectMutation, DeleteObjectMutationVariables>;

    export function useDeleteObjectMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteObjectMutation, DeleteObjectMutationVariables>) {
      return ApolloReactHooks.useMutation<DeleteObjectMutation, DeleteObjectMutationVariables>(DeleteObjectDocument, baseOptions);
    }
export type DeleteObjectMutationHookResult = ReturnType<typeof useDeleteObjectMutation>;
export type DeleteObjectMutationResult = ApolloReactCommon.MutationResult<DeleteObjectMutation>;
export type DeleteObjectMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteObjectMutation, DeleteObjectMutationVariables>;
export const ResourceDetailDocument = gql`
    query ResourceDetail($id: ID!) {
  resource(id: $id) {
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
    query SchoolDetail($id: ID!) {
  school(id: $id) {
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
    query SearchCourses($courseName: String, $courseCode: String, $school: ID, $subject: ID, $schoolType: ID, $country: ID, $city: ID) {
  courses(courseName: $courseName, courseCode: $courseCode, school: $school, subject: $subject, schoolType: $schoolType, country: $country, city: $city) {
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
    query UploadResourceInitialData($course: ID!) {
  course(id: $course) {
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
    mutation UploadResource($resourceTitle: String!, $resourceType: ID!, $course: ID!, $files: String!) {
  uploadResource(input: {title: $resourceTitle, resourceType: $resourceType, course: $course, files: $files}) {
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
    query UserDetail($id: ID!) {
  user(id: $id) {
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
export const CreateVoteDocument = gql`
    mutation CreateVote($status: String!, $comment: ID, $course: ID, $resource: ID) {
  createVote(input: {status: $status, comment: $comment, course: $course, resource: $resource}) {
    vote {
      id
      status
    }
    errors {
      field
      messages
    }
  }
}
    `;
export type CreateVoteMutationFn = ApolloReactCommon.MutationFunction<CreateVoteMutation, CreateVoteMutationVariables>;

    export function useCreateVoteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateVoteMutation, CreateVoteMutationVariables>) {
      return ApolloReactHooks.useMutation<CreateVoteMutation, CreateVoteMutationVariables>(CreateVoteDocument, baseOptions);
    }
export type CreateVoteMutationHookResult = ReturnType<typeof useCreateVoteMutation>;
export type CreateVoteMutationResult = ApolloReactCommon.MutationResult<CreateVoteMutation>;
export type CreateVoteMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateVoteMutation, CreateVoteMutationVariables>;