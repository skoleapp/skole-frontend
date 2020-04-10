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
  name?: Maybe<Scalars['String']>,
};

export type CommentObjectType = {
   __typename?: 'CommentObjectType',
  id: Scalars['ID'],
  user?: Maybe<UserObjectType>,
  text: Scalars['String'],
  attachment: Scalars['String'],
  course?: Maybe<CourseObjectType>,
  resource?: Maybe<ResourceObjectType>,
  comment?: Maybe<CommentObjectType>,
  modified: Scalars['DateTime'],
  created: Scalars['DateTime'],
  replyComments: Array<CommentObjectType>,
  points?: Maybe<Scalars['Int']>,
  vote?: Maybe<VoteObjectType>,
  replyCount?: Maybe<Scalars['Int']>,
};

export type ContactMutationInput = {
  subject: Scalars['String'],
  name?: Maybe<Scalars['String']>,
  email: Scalars['String'],
  message: Scalars['String'],
  clientMutationId?: Maybe<Scalars['String']>,
};

export type ContactMutationPayload = {
   __typename?: 'ContactMutationPayload',
  subject: Scalars['String'],
  name?: Maybe<Scalars['String']>,
  email: Scalars['String'],
  message?: Maybe<Scalars['String']>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CountryObjectType = {
   __typename?: 'CountryObjectType',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
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
  starred?: Maybe<Scalars['Boolean']>,
  points?: Maybe<Scalars['Int']>,
  vote?: Maybe<VoteObjectType>,
  resourceCount?: Maybe<Scalars['Int']>,
};

export type CreateCommentMutationInput = {
  text?: Maybe<Scalars['String']>,
  attachment?: Maybe<Scalars['String']>,
  course?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>,
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
  file?: Maybe<Scalars['String']>,
  resourceType: Scalars['ID'],
  course: Scalars['ID'],
  date?: Maybe<Scalars['Date']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CreateResourceMutationPayload = {
   __typename?: 'CreateResourceMutationPayload',
  resource?: Maybe<ResourceObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};



export type DeleteCommentMutationInput = {
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type DeleteCommentMutationPayload = {
   __typename?: 'DeleteCommentMutationPayload',
  message?: Maybe<Scalars['String']>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type DeleteCourseMutationInput = {
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type DeleteCourseMutationPayload = {
   __typename?: 'DeleteCourseMutationPayload',
  message?: Maybe<Scalars['String']>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type DeleteResourceMutationInput = {
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type DeleteResourceMutationPayload = {
   __typename?: 'DeleteResourceMutationPayload',
  message?: Maybe<Scalars['String']>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
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
  username: Scalars['String'],
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
  performStar?: Maybe<StarredMutationPayload>,
  performVote?: Maybe<VoteMutationPayload>,
  login?: Maybe<LoginMutationPayload>,
  register?: Maybe<RegisterMutationPayload>,
  updateUser?: Maybe<UpdateUserMutationPayload>,
  changePassword?: Maybe<ChangePasswordMutationPayload>,
  deleteUser?: Maybe<DeleteUserMutationPayload>,
  createResource?: Maybe<CreateResourceMutationPayload>,
  updateResource?: Maybe<UpdateResourceMutationPayload>,
  deleteResource?: Maybe<DeleteResourceMutationPayload>,
  createCourse?: Maybe<CreateCourseMutationPayload>,
  deleteCourse?: Maybe<DeleteCourseMutationPayload>,
  createMessage?: Maybe<ContactMutationPayload>,
  createComment?: Maybe<CreateCommentMutationPayload>,
  updateComment?: Maybe<UpdateCommentMutationPayload>,
  deleteComment?: Maybe<DeleteCommentMutationPayload>,
};


export type MutationPerformStarArgs = {
  input: StarredMutationInput
};


export type MutationPerformVoteArgs = {
  input: VoteMutationInput
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


export type MutationCreateResourceArgs = {
  input: CreateResourceMutationInput
};


export type MutationUpdateResourceArgs = {
  input: UpdateResourceMutationInput
};


export type MutationDeleteResourceArgs = {
  input: DeleteResourceMutationInput
};


export type MutationCreateCourseArgs = {
  input: CreateCourseMutationInput
};


export type MutationDeleteCourseArgs = {
  input: DeleteCourseMutationInput
};


export type MutationCreateMessageArgs = {
  input: ContactMutationInput
};


export type MutationCreateCommentArgs = {
  input: CreateCommentMutationInput
};


export type MutationUpdateCommentArgs = {
  input: UpdateCommentMutationInput
};


export type MutationDeleteCommentArgs = {
  input: DeleteCommentMutationInput
};

export type PaginatedCourseObjectType = {
   __typename?: 'PaginatedCourseObjectType',
  page?: Maybe<Scalars['Int']>,
  pages?: Maybe<Scalars['Int']>,
  hasNext?: Maybe<Scalars['Boolean']>,
  hasPrev?: Maybe<Scalars['Boolean']>,
  count?: Maybe<Scalars['Int']>,
  objects?: Maybe<Array<Maybe<CourseObjectType>>>,
};

export type PaginatedUserObjectType = {
   __typename?: 'PaginatedUserObjectType',
  page?: Maybe<Scalars['Int']>,
  pages?: Maybe<Scalars['Int']>,
  hasNext?: Maybe<Scalars['Boolean']>,
  hasPrev?: Maybe<Scalars['Boolean']>,
  count?: Maybe<Scalars['Int']>,
  objects?: Maybe<Array<Maybe<UserObjectType>>>,
};

export type Query = {
   __typename?: 'Query',
  users?: Maybe<PaginatedUserObjectType>,
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
  searchCourses?: Maybe<PaginatedCourseObjectType>,
  courses?: Maybe<Array<Maybe<CourseObjectType>>>,
  course?: Maybe<CourseObjectType>,
  countries?: Maybe<Array<Maybe<CountryObjectType>>>,
  country?: Maybe<CountryObjectType>,
  comment?: Maybe<CommentObjectType>,
  cities?: Maybe<Array<Maybe<CityObjectType>>>,
  city?: Maybe<CityObjectType>,
};


export type QueryUsersArgs = {
  page?: Maybe<Scalars['Int']>,
  pageSize?: Maybe<Scalars['Int']>,
  username?: Maybe<Scalars['String']>,
  ordering?: Maybe<Scalars['String']>
};


export type QueryUserArgs = {
  id?: Maybe<Scalars['ID']>
};


export type QuerySubjectArgs = {
  id?: Maybe<Scalars['ID']>
};


export type QuerySchoolTypeArgs = {
  id?: Maybe<Scalars['ID']>
};


export type QuerySchoolArgs = {
  id?: Maybe<Scalars['ID']>
};


export type QueryResourceArgs = {
  id?: Maybe<Scalars['ID']>
};


export type QuerySearchCoursesArgs = {
  courseName?: Maybe<Scalars['String']>,
  courseCode?: Maybe<Scalars['String']>,
  subject?: Maybe<Scalars['ID']>,
  school?: Maybe<Scalars['ID']>,
  schoolType?: Maybe<Scalars['ID']>,
  country?: Maybe<Scalars['ID']>,
  city?: Maybe<Scalars['ID']>,
  page?: Maybe<Scalars['Int']>,
  pageSize?: Maybe<Scalars['Int']>,
  ordering?: Maybe<Scalars['String']>
};


export type QueryCourseArgs = {
  id?: Maybe<Scalars['ID']>
};


export type QueryCountryArgs = {
  id?: Maybe<Scalars['ID']>
};


export type QueryCommentArgs = {
  id?: Maybe<Scalars['ID']>
};


export type QueryCityArgs = {
  id?: Maybe<Scalars['ID']>
};

export type RegisterMutationInput = {
  username: Scalars['String'],
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
  file: Scalars['String'],
  date: Scalars['Date'],
  course: CourseObjectType,
  downloads: Scalars['Int'],
  user?: Maybe<UserObjectType>,
  modified: Scalars['DateTime'],
  created: Scalars['DateTime'],
  comments: Array<CommentObjectType>,
  starred?: Maybe<Scalars['Boolean']>,
  points?: Maybe<Scalars['Int']>,
  vote?: Maybe<VoteObjectType>,
  resourceType?: Maybe<Scalars['String']>,
  school?: Maybe<SchoolObjectType>,
};

export type ResourceTypeObjectType = {
   __typename?: 'ResourceTypeObjectType',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
};

export type SchoolObjectType = {
   __typename?: 'SchoolObjectType',
  id: Scalars['ID'],
  courses: Array<CourseObjectType>,
  name?: Maybe<Scalars['String']>,
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
  name?: Maybe<Scalars['String']>,
};

export type StarredMutationInput = {
  course?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type StarredMutationPayload = {
   __typename?: 'StarredMutationPayload',
  starred?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type SubjectObjectType = {
   __typename?: 'SubjectObjectType',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
};

export type UpdateCommentMutationInput = {
  text?: Maybe<Scalars['String']>,
  attachment?: Maybe<Scalars['String']>,
  course?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>,
  comment?: Maybe<Scalars['ID']>,
  id?: Maybe<Scalars['ID']>,
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
  file?: Maybe<Scalars['String']>,
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

export type UpdateUserMutationInput = {
  username: Scalars['String'],
  email?: Maybe<Scalars['String']>,
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
  points?: Maybe<Scalars['Int']>,
  avatarThumbnail?: Maybe<Scalars['String']>,
  courseCount?: Maybe<Scalars['Int']>,
  resourceCount?: Maybe<Scalars['Int']>,
  starredCourses?: Maybe<Array<Maybe<CourseObjectType>>>,
  starredResources?: Maybe<Array<Maybe<ResourceObjectType>>>,
};

export type VoteMutationInput = {
  status: Scalars['Int'],
  comment?: Maybe<Scalars['ID']>,
  course?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type VoteMutationPayload = {
   __typename?: 'VoteMutationPayload',
  vote?: Maybe<VoteObjectType>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  targetPoints?: Maybe<Scalars['Int']>,
  clientMutationId?: Maybe<Scalars['String']>,
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
      & Pick<UserObjectType, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'points' | 'courseCount' | 'resourceCount' | 'created'>
      & { starredCourses: Maybe<Array<Maybe<(
        { __typename?: 'CourseObjectType' }
        & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'points'>
      )>>>, starredResources: Maybe<Array<Maybe<(
        { __typename?: 'ResourceObjectType' }
        & Pick<ResourceObjectType, 'id' | 'title' | 'points' | 'date'>
      )>>> }
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type LoginMutationVariables = {
  username: Scalars['String'],
  password: Scalars['String']
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: Maybe<(
    { __typename?: 'LoginMutationPayload' }
    & Pick<LoginMutationPayload, 'token'>
    & { user: Maybe<(
      { __typename?: 'UserObjectType' }
      & Pick<UserObjectType, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'points' | 'courseCount' | 'resourceCount' | 'created'>
      & { starredCourses: Maybe<Array<Maybe<(
        { __typename?: 'CourseObjectType' }
        & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'points'>
      )>>>, starredResources: Maybe<Array<Maybe<(
        { __typename?: 'ResourceObjectType' }
        & Pick<ResourceObjectType, 'id' | 'title' | 'points' | 'date'>
      )>>> }
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
    & { starredCourses: Maybe<Array<Maybe<(
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'points'>
    )>>>, starredResources: Maybe<Array<Maybe<(
      { __typename?: 'ResourceObjectType' }
      & Pick<ResourceObjectType, 'id' | 'title' | 'points' | 'date'>
    )>>> }
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

export type CreateCommentMutationVariables = {
  text: Scalars['String'],
  attachment?: Maybe<Scalars['String']>,
  course?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>,
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

export type DeleteCommentMutationVariables = {
  id?: Maybe<Scalars['ID']>
};


export type DeleteCommentMutation = (
  { __typename?: 'Mutation' }
  & { deleteComment: Maybe<(
    { __typename?: 'DeleteCommentMutationPayload' }
    & Pick<DeleteCommentMutationPayload, 'message'>
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

export type ContactMutationVariables = {
  subject: Scalars['String'],
  name?: Maybe<Scalars['String']>,
  email: Scalars['String'],
  message: Scalars['String']
};


export type ContactMutation = (
  { __typename?: 'Mutation' }
  & { createMessage: Maybe<(
    { __typename?: 'ContactMutationPayload' }
    & Pick<ContactMutationPayload, 'message'>
    & { errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type CourseDetailQueryVariables = {
  id?: Maybe<Scalars['ID']>
};


export type CourseDetailQuery = (
  { __typename?: 'Query' }
  & { course: Maybe<(
    { __typename?: 'CourseObjectType' }
    & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'modified' | 'created' | 'points' | 'resourceCount' | 'starred'>
    & { vote: Maybe<(
      { __typename?: 'VoteObjectType' }
      & Pick<VoteObjectType, 'id' | 'status'>
    )>, subject: Maybe<(
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
      & Pick<ResourceObjectType, 'id' | 'title' | 'points' | 'date'>
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

export type DeleteCourseMutationVariables = {
  id?: Maybe<Scalars['ID']>
};


export type DeleteCourseMutation = (
  { __typename?: 'Mutation' }
  & { deleteCourse: Maybe<(
    { __typename?: 'DeleteCourseMutationPayload' }
    & Pick<DeleteCourseMutationPayload, 'message'>
    & { errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
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

export type CreateResourceInitialDataQueryVariables = {
  course?: Maybe<Scalars['ID']>
};


export type CreateResourceInitialDataQuery = (
  { __typename?: 'Query' }
  & { course: Maybe<(
    { __typename?: 'CourseObjectType' }
    & Pick<CourseObjectType, 'id' | 'name'>
  )> }
);

export type CreateResourceMutationVariables = {
  resourceTitle: Scalars['String'],
  resourceType: Scalars['ID'],
  course: Scalars['ID'],
  file: Scalars['String']
};


export type CreateResourceMutation = (
  { __typename?: 'Mutation' }
  & { createResource: Maybe<(
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

export type ResourceDetailQueryVariables = {
  id?: Maybe<Scalars['ID']>
};


export type ResourceDetailQuery = (
  { __typename?: 'Query' }
  & { resource: Maybe<(
    { __typename?: 'ResourceObjectType' }
    & Pick<ResourceObjectType, 'id' | 'title' | 'resourceType' | 'file' | 'date' | 'modified' | 'created' | 'points' | 'starred'>
    & { school: Maybe<(
      { __typename?: 'SchoolObjectType' }
      & Pick<SchoolObjectType, 'id' | 'name'>
    )>, course: (
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id' | 'name'>
    ), user: Maybe<(
      { __typename?: 'UserObjectType' }
      & Pick<UserObjectType, 'id' | 'username'>
    )>, vote: Maybe<(
      { __typename?: 'VoteObjectType' }
      & Pick<VoteObjectType, 'id' | 'status'>
    )>, comments: Array<(
      { __typename?: 'CommentObjectType' }
      & Pick<CommentObjectType, 'id' | 'text' | 'attachment' | 'modified' | 'created' | 'points' | 'replyCount'>
      & { user: Maybe<(
        { __typename?: 'UserObjectType' }
        & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
      )>, vote: Maybe<(
        { __typename?: 'VoteObjectType' }
        & Pick<VoteObjectType, 'id' | 'status'>
      )>, replyComments: Array<(
        { __typename?: 'CommentObjectType' }
        & Pick<CommentObjectType, 'id' | 'text' | 'attachment' | 'points'>
        & { user: Maybe<(
          { __typename?: 'UserObjectType' }
          & Pick<UserObjectType, 'id' | 'username' | 'avatarThumbnail'>
        )>, vote: Maybe<(
          { __typename?: 'VoteObjectType' }
          & Pick<VoteObjectType, 'id' | 'status'>
        )> }
      )> }
    )> }
  )> }
);

export type DeleteResourceMutationVariables = {
  id?: Maybe<Scalars['ID']>
};


export type DeleteResourceMutation = (
  { __typename?: 'Mutation' }
  & { deleteResource: Maybe<(
    { __typename?: 'DeleteResourceMutationPayload' }
    & Pick<DeleteResourceMutationPayload, 'message'>
    & { errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type SchoolDetailQueryVariables = {
  id?: Maybe<Scalars['ID']>
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
  city?: Maybe<Scalars['ID']>,
  ordering?: Maybe<Scalars['String']>,
  page?: Maybe<Scalars['Int']>,
  pageSize?: Maybe<Scalars['Int']>
};


export type SearchCoursesQuery = (
  { __typename?: 'Query' }
  & { searchCourses: Maybe<(
    { __typename?: 'PaginatedCourseObjectType' }
    & Pick<PaginatedCourseObjectType, 'page' | 'pages' | 'hasPrev' | 'hasNext' | 'count'>
    & { objects: Maybe<Array<Maybe<(
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'points'>
    )>>> }
  )>, school: Maybe<(
    { __typename?: 'SchoolObjectType' }
    & Pick<SchoolObjectType, 'id' | 'name'>
  )>, subject: Maybe<(
    { __typename?: 'SubjectObjectType' }
    & Pick<SubjectObjectType, 'id' | 'name'>
  )>, schoolType: Maybe<(
    { __typename?: 'SchoolTypeObjectType' }
    & Pick<SchoolTypeObjectType, 'id' | 'name'>
  )>, country: Maybe<(
    { __typename?: 'CountryObjectType' }
    & Pick<CountryObjectType, 'id' | 'name'>
  )>, city: Maybe<(
    { __typename?: 'CityObjectType' }
    & Pick<CityObjectType, 'id' | 'name'>
  )> }
);

export type PerformStarMutationVariables = {
  course?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>
};


export type PerformStarMutation = (
  { __typename?: 'Mutation' }
  & { performStar: Maybe<(
    { __typename?: 'StarredMutationPayload' }
    & Pick<StarredMutationPayload, 'starred'>
    & { errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type UsersQueryVariables = {
  username?: Maybe<Scalars['String']>,
  ordering?: Maybe<Scalars['String']>,
  page?: Maybe<Scalars['Int']>,
  pageSize?: Maybe<Scalars['Int']>
};


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Maybe<(
    { __typename?: 'PaginatedUserObjectType' }
    & Pick<PaginatedUserObjectType, 'page' | 'pages' | 'hasPrev' | 'hasNext' | 'count'>
    & { objects: Maybe<Array<Maybe<(
      { __typename?: 'UserObjectType' }
      & Pick<UserObjectType, 'id' | 'username' | 'points' | 'avatarThumbnail'>
    )>>> }
  )> }
);

export type UserDetailQueryVariables = {
  id?: Maybe<Scalars['ID']>
};


export type UserDetailQuery = (
  { __typename?: 'Query' }
  & { user: Maybe<(
    { __typename?: 'UserObjectType' }
    & Pick<UserObjectType, 'id' | 'username' | 'title' | 'bio' | 'avatar' | 'points' | 'courseCount' | 'resourceCount' | 'created'>
    & { createdCourses: Array<(
      { __typename?: 'CourseObjectType' }
      & Pick<CourseObjectType, 'id' | 'name' | 'code' | 'points'>
    )>, createdResources: Array<(
      { __typename?: 'ResourceObjectType' }
      & Pick<ResourceObjectType, 'id' | 'title' | 'points' | 'date'>
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

export type PerformVoteMutationVariables = {
  status: Scalars['Int'],
  comment?: Maybe<Scalars['ID']>,
  course?: Maybe<Scalars['ID']>,
  resource?: Maybe<Scalars['ID']>
};


export type PerformVoteMutation = (
  { __typename?: 'Mutation' }
  & { performVote: Maybe<(
    { __typename?: 'VoteMutationPayload' }
    & Pick<VoteMutationPayload, 'targetPoints'>
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
    mutation Register($username: String!, $password: String!, $code: String!) {
  register(input: {username: $username, password: $password, code: $code}) {
    user {
      id
      created
    }
    errors {
      field
      messages
    }
  }
  login(input: {username: $username, password: $password}) {
    token
    user {
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
      starredCourses {
        id
        name
        code
        points
      }
      starredResources {
        id
        title
        points
        date
      }
    }
    errors {
      field
      messages
    }
  }
}
    `;
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<RegisterMutation, RegisterMutationVariables>;

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
 *      password: // value for 'password'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(input: {username: $username, password: $password}) {
    token
    user {
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
      starredCourses {
        id
        name
        code
        points
      }
      starredResources {
        id
        title
        points
        date
      }
    }
    errors {
      field
      messages
    }
  }
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

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
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
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
    starredCourses {
      id
      name
      code
      points
    }
    starredResources {
      id
      title
      points
      date
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
export function useUserMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserMeQuery, UserMeQueryVariables>) {
        return ApolloReactHooks.useQuery<UserMeQuery, UserMeQueryVariables>(UserMeDocument, baseOptions);
      }
export function useUserMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserMeQuery, UserMeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserMeQuery, UserMeQueryVariables>(UserMeDocument, baseOptions);
        }
export type UserMeQueryHookResult = ReturnType<typeof useUserMeQuery>;
export type UserMeLazyQueryHookResult = ReturnType<typeof useUserMeLazyQuery>;
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
export function useDeleteAccountMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, baseOptions);
      }
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>;
export type DeleteAccountMutationResult = ApolloReactCommon.MutationResult<DeleteAccountMutation>;
export type DeleteAccountMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const CreateCommentDocument = gql`
    mutation CreateComment($text: String!, $attachment: String, $course: ID, $resource: ID, $comment: ID) {
  createComment(input: {text: $text, attachment: $attachment, course: $course, resource: $resource, comment: $comment}) {
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
export function useCreateCommentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, baseOptions);
      }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = ApolloReactCommon.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
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
export type DeleteCommentMutationFn = ApolloReactCommon.MutationFunction<DeleteCommentMutation, DeleteCommentMutationVariables>;

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
export function useDeleteCommentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteCommentMutation, DeleteCommentMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument, baseOptions);
      }
export type DeleteCommentMutationHookResult = ReturnType<typeof useDeleteCommentMutation>;
export type DeleteCommentMutationResult = ApolloReactCommon.MutationResult<DeleteCommentMutation>;
export type DeleteCommentMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteCommentMutation, DeleteCommentMutationVariables>;
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
export function useSchoolsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SchoolsQuery, SchoolsQueryVariables>) {
        return ApolloReactHooks.useQuery<SchoolsQuery, SchoolsQueryVariables>(SchoolsDocument, baseOptions);
      }
export function useSchoolsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SchoolsQuery, SchoolsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SchoolsQuery, SchoolsQueryVariables>(SchoolsDocument, baseOptions);
        }
export type SchoolsQueryHookResult = ReturnType<typeof useSchoolsQuery>;
export type SchoolsLazyQueryHookResult = ReturnType<typeof useSchoolsLazyQuery>;
export type SchoolsQueryResult = ApolloReactCommon.QueryResult<SchoolsQuery, SchoolsQueryVariables>;
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
export function useSchoolTypesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SchoolTypesQuery, SchoolTypesQueryVariables>) {
        return ApolloReactHooks.useQuery<SchoolTypesQuery, SchoolTypesQueryVariables>(SchoolTypesDocument, baseOptions);
      }
export function useSchoolTypesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SchoolTypesQuery, SchoolTypesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SchoolTypesQuery, SchoolTypesQueryVariables>(SchoolTypesDocument, baseOptions);
        }
export type SchoolTypesQueryHookResult = ReturnType<typeof useSchoolTypesQuery>;
export type SchoolTypesLazyQueryHookResult = ReturnType<typeof useSchoolTypesLazyQuery>;
export type SchoolTypesQueryResult = ApolloReactCommon.QueryResult<SchoolTypesQuery, SchoolTypesQueryVariables>;
export const CoursesDocument = gql`
    query Courses {
  courses {
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
 *   },
 * });
 */
export function useCoursesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CoursesQuery, CoursesQueryVariables>) {
        return ApolloReactHooks.useQuery<CoursesQuery, CoursesQueryVariables>(CoursesDocument, baseOptions);
      }
export function useCoursesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CoursesQuery, CoursesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CoursesQuery, CoursesQueryVariables>(CoursesDocument, baseOptions);
        }
export type CoursesQueryHookResult = ReturnType<typeof useCoursesQuery>;
export type CoursesLazyQueryHookResult = ReturnType<typeof useCoursesLazyQuery>;
export type CoursesQueryResult = ApolloReactCommon.QueryResult<CoursesQuery, CoursesQueryVariables>;
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
export function useSubjectsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SubjectsQuery, SubjectsQueryVariables>) {
        return ApolloReactHooks.useQuery<SubjectsQuery, SubjectsQueryVariables>(SubjectsDocument, baseOptions);
      }
export function useSubjectsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SubjectsQuery, SubjectsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SubjectsQuery, SubjectsQueryVariables>(SubjectsDocument, baseOptions);
        }
export type SubjectsQueryHookResult = ReturnType<typeof useSubjectsQuery>;
export type SubjectsLazyQueryHookResult = ReturnType<typeof useSubjectsLazyQuery>;
export type SubjectsQueryResult = ApolloReactCommon.QueryResult<SubjectsQuery, SubjectsQueryVariables>;
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
export function useCountriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CountriesQuery, CountriesQueryVariables>) {
        return ApolloReactHooks.useQuery<CountriesQuery, CountriesQueryVariables>(CountriesDocument, baseOptions);
      }
export function useCountriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CountriesQuery, CountriesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CountriesQuery, CountriesQueryVariables>(CountriesDocument, baseOptions);
        }
export type CountriesQueryHookResult = ReturnType<typeof useCountriesQuery>;
export type CountriesLazyQueryHookResult = ReturnType<typeof useCountriesLazyQuery>;
export type CountriesQueryResult = ApolloReactCommon.QueryResult<CountriesQuery, CountriesQueryVariables>;
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
export function useCitiesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CitiesQuery, CitiesQueryVariables>) {
        return ApolloReactHooks.useQuery<CitiesQuery, CitiesQueryVariables>(CitiesDocument, baseOptions);
      }
export function useCitiesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CitiesQuery, CitiesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CitiesQuery, CitiesQueryVariables>(CitiesDocument, baseOptions);
        }
export type CitiesQueryHookResult = ReturnType<typeof useCitiesQuery>;
export type CitiesLazyQueryHookResult = ReturnType<typeof useCitiesLazyQuery>;
export type CitiesQueryResult = ApolloReactCommon.QueryResult<CitiesQuery, CitiesQueryVariables>;
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
export function useResourceTypesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ResourceTypesQuery, ResourceTypesQueryVariables>) {
        return ApolloReactHooks.useQuery<ResourceTypesQuery, ResourceTypesQueryVariables>(ResourceTypesDocument, baseOptions);
      }
export function useResourceTypesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ResourceTypesQuery, ResourceTypesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ResourceTypesQuery, ResourceTypesQueryVariables>(ResourceTypesDocument, baseOptions);
        }
export type ResourceTypesQueryHookResult = ReturnType<typeof useResourceTypesQuery>;
export type ResourceTypesLazyQueryHookResult = ReturnType<typeof useResourceTypesLazyQuery>;
export type ResourceTypesQueryResult = ApolloReactCommon.QueryResult<ResourceTypesQuery, ResourceTypesQueryVariables>;
export const ContactDocument = gql`
    mutation Contact($subject: String!, $name: String, $email: String!, $message: String!) {
  createMessage(input: {subject: $subject, name: $name, email: $email, message: $message}) {
    message
    errors {
      field
      messages
    }
  }
}
    `;
export type ContactMutationFn = ApolloReactCommon.MutationFunction<ContactMutation, ContactMutationVariables>;

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
export function useContactMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ContactMutation, ContactMutationVariables>) {
        return ApolloReactHooks.useMutation<ContactMutation, ContactMutationVariables>(ContactDocument, baseOptions);
      }
export type ContactMutationHookResult = ReturnType<typeof useContactMutation>;
export type ContactMutationResult = ApolloReactCommon.MutationResult<ContactMutation>;
export type ContactMutationOptions = ApolloReactCommon.BaseMutationOptions<ContactMutation, ContactMutationVariables>;
export const CourseDetailDocument = gql`
    query CourseDetail($id: ID) {
  course(id: $id) {
    id
    name
    code
    modified
    created
    points
    resourceCount
    starred
    vote {
      id
      status
    }
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
export function useCourseDetailQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CourseDetailQuery, CourseDetailQueryVariables>) {
        return ApolloReactHooks.useQuery<CourseDetailQuery, CourseDetailQueryVariables>(CourseDetailDocument, baseOptions);
      }
export function useCourseDetailLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CourseDetailQuery, CourseDetailQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CourseDetailQuery, CourseDetailQueryVariables>(CourseDetailDocument, baseOptions);
        }
export type CourseDetailQueryHookResult = ReturnType<typeof useCourseDetailQuery>;
export type CourseDetailLazyQueryHookResult = ReturnType<typeof useCourseDetailLazyQuery>;
export type CourseDetailQueryResult = ApolloReactCommon.QueryResult<CourseDetailQuery, CourseDetailQueryVariables>;
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
export type DeleteCourseMutationFn = ApolloReactCommon.MutationFunction<DeleteCourseMutation, DeleteCourseMutationVariables>;

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
export function useDeleteCourseMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteCourseMutation, DeleteCourseMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteCourseMutation, DeleteCourseMutationVariables>(DeleteCourseDocument, baseOptions);
      }
export type DeleteCourseMutationHookResult = ReturnType<typeof useDeleteCourseMutation>;
export type DeleteCourseMutationResult = ApolloReactCommon.MutationResult<DeleteCourseMutation>;
export type DeleteCourseMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteCourseMutation, DeleteCourseMutationVariables>;
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
 *      subject: // value for 'subject'
 *      school: // value for 'school'
 *   },
 * });
 */
export function useCreateCourseMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCourseMutation, CreateCourseMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateCourseMutation, CreateCourseMutationVariables>(CreateCourseDocument, baseOptions);
      }
export type CreateCourseMutationHookResult = ReturnType<typeof useCreateCourseMutation>;
export type CreateCourseMutationResult = ApolloReactCommon.MutationResult<CreateCourseMutation>;
export type CreateCourseMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateCourseMutation, CreateCourseMutationVariables>;
export const CreateResourceInitialDataDocument = gql`
    query CreateResourceInitialData($course: ID) {
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
 *      course: // value for 'course'
 *   },
 * });
 */
export function useCreateResourceInitialDataQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CreateResourceInitialDataQuery, CreateResourceInitialDataQueryVariables>) {
        return ApolloReactHooks.useQuery<CreateResourceInitialDataQuery, CreateResourceInitialDataQueryVariables>(CreateResourceInitialDataDocument, baseOptions);
      }
export function useCreateResourceInitialDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CreateResourceInitialDataQuery, CreateResourceInitialDataQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CreateResourceInitialDataQuery, CreateResourceInitialDataQueryVariables>(CreateResourceInitialDataDocument, baseOptions);
        }
export type CreateResourceInitialDataQueryHookResult = ReturnType<typeof useCreateResourceInitialDataQuery>;
export type CreateResourceInitialDataLazyQueryHookResult = ReturnType<typeof useCreateResourceInitialDataLazyQuery>;
export type CreateResourceInitialDataQueryResult = ApolloReactCommon.QueryResult<CreateResourceInitialDataQuery, CreateResourceInitialDataQueryVariables>;
export const CreateResourceDocument = gql`
    mutation CreateResource($resourceTitle: String!, $resourceType: ID!, $course: ID!, $file: String!) {
  createResource(input: {title: $resourceTitle, resourceType: $resourceType, course: $course, file: $file}) {
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
export type CreateResourceMutationFn = ApolloReactCommon.MutationFunction<CreateResourceMutation, CreateResourceMutationVariables>;

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
export function useCreateResourceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateResourceMutation, CreateResourceMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateResourceMutation, CreateResourceMutationVariables>(CreateResourceDocument, baseOptions);
      }
export type CreateResourceMutationHookResult = ReturnType<typeof useCreateResourceMutation>;
export type CreateResourceMutationResult = ApolloReactCommon.MutationResult<CreateResourceMutation>;
export type CreateResourceMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateResourceMutation, CreateResourceMutationVariables>;
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
    points
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
      points
      replyCount
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
        points
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
export function useResourceDetailQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ResourceDetailQuery, ResourceDetailQueryVariables>) {
        return ApolloReactHooks.useQuery<ResourceDetailQuery, ResourceDetailQueryVariables>(ResourceDetailDocument, baseOptions);
      }
export function useResourceDetailLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ResourceDetailQuery, ResourceDetailQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ResourceDetailQuery, ResourceDetailQueryVariables>(ResourceDetailDocument, baseOptions);
        }
export type ResourceDetailQueryHookResult = ReturnType<typeof useResourceDetailQuery>;
export type ResourceDetailLazyQueryHookResult = ReturnType<typeof useResourceDetailLazyQuery>;
export type ResourceDetailQueryResult = ApolloReactCommon.QueryResult<ResourceDetailQuery, ResourceDetailQueryVariables>;
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
export type DeleteResourceMutationFn = ApolloReactCommon.MutationFunction<DeleteResourceMutation, DeleteResourceMutationVariables>;

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
export function useDeleteResourceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteResourceMutation, DeleteResourceMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteResourceMutation, DeleteResourceMutationVariables>(DeleteResourceDocument, baseOptions);
      }
export type DeleteResourceMutationHookResult = ReturnType<typeof useDeleteResourceMutation>;
export type DeleteResourceMutationResult = ApolloReactCommon.MutationResult<DeleteResourceMutation>;
export type DeleteResourceMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteResourceMutation, DeleteResourceMutationVariables>;
export const SchoolDetailDocument = gql`
    query SchoolDetail($id: ID) {
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
export function useSchoolDetailQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SchoolDetailQuery, SchoolDetailQueryVariables>) {
        return ApolloReactHooks.useQuery<SchoolDetailQuery, SchoolDetailQueryVariables>(SchoolDetailDocument, baseOptions);
      }
export function useSchoolDetailLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SchoolDetailQuery, SchoolDetailQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SchoolDetailQuery, SchoolDetailQueryVariables>(SchoolDetailDocument, baseOptions);
        }
export type SchoolDetailQueryHookResult = ReturnType<typeof useSchoolDetailQuery>;
export type SchoolDetailLazyQueryHookResult = ReturnType<typeof useSchoolDetailLazyQuery>;
export type SchoolDetailQueryResult = ApolloReactCommon.QueryResult<SchoolDetailQuery, SchoolDetailQueryVariables>;
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
      points
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
export function useSearchCoursesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchCoursesQuery, SearchCoursesQueryVariables>) {
        return ApolloReactHooks.useQuery<SearchCoursesQuery, SearchCoursesQueryVariables>(SearchCoursesDocument, baseOptions);
      }
export function useSearchCoursesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchCoursesQuery, SearchCoursesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SearchCoursesQuery, SearchCoursesQueryVariables>(SearchCoursesDocument, baseOptions);
        }
export type SearchCoursesQueryHookResult = ReturnType<typeof useSearchCoursesQuery>;
export type SearchCoursesLazyQueryHookResult = ReturnType<typeof useSearchCoursesLazyQuery>;
export type SearchCoursesQueryResult = ApolloReactCommon.QueryResult<SearchCoursesQuery, SearchCoursesQueryVariables>;
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
export type PerformStarMutationFn = ApolloReactCommon.MutationFunction<PerformStarMutation, PerformStarMutationVariables>;

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
export function usePerformStarMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PerformStarMutation, PerformStarMutationVariables>) {
        return ApolloReactHooks.useMutation<PerformStarMutation, PerformStarMutationVariables>(PerformStarDocument, baseOptions);
      }
export type PerformStarMutationHookResult = ReturnType<typeof usePerformStarMutation>;
export type PerformStarMutationResult = ApolloReactCommon.MutationResult<PerformStarMutation>;
export type PerformStarMutationOptions = ApolloReactCommon.BaseMutationOptions<PerformStarMutation, PerformStarMutationVariables>;
export const UsersDocument = gql`
    query Users($username: String, $ordering: String, $page: Int, $pageSize: Int) {
  users(username: $username, ordering: $ordering, page: $page, pageSize: $pageSize) {
    page
    pages
    hasPrev
    hasNext
    count
    objects {
      id
      username
      points
      avatarThumbnail
    }
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      username: // value for 'username'
 *      ordering: // value for 'ordering'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      }
export function useUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = ApolloReactCommon.QueryResult<UsersQuery, UsersQueryVariables>;
export const UserDetailDocument = gql`
    query UserDetail($id: ID) {
  user(id: $id) {
    id
    username
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
export function useUserDetailQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserDetailQuery, UserDetailQueryVariables>) {
        return ApolloReactHooks.useQuery<UserDetailQuery, UserDetailQueryVariables>(UserDetailDocument, baseOptions);
      }
export function useUserDetailLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserDetailQuery, UserDetailQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserDetailQuery, UserDetailQueryVariables>(UserDetailDocument, baseOptions);
        }
export type UserDetailQueryHookResult = ReturnType<typeof useUserDetailQuery>;
export type UserDetailLazyQueryHookResult = ReturnType<typeof useUserDetailLazyQuery>;
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
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, baseOptions);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = ApolloReactCommon.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const PerformVoteDocument = gql`
    mutation PerformVote($status: Int!, $comment: ID, $course: ID, $resource: ID) {
  performVote(input: {status: $status, comment: $comment, course: $course, resource: $resource}) {
    vote {
      id
      status
    }
    targetPoints
    errors {
      field
      messages
    }
  }
}
    `;
export type PerformVoteMutationFn = ApolloReactCommon.MutationFunction<PerformVoteMutation, PerformVoteMutationVariables>;

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
export function usePerformVoteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PerformVoteMutation, PerformVoteMutationVariables>) {
        return ApolloReactHooks.useMutation<PerformVoteMutation, PerformVoteMutationVariables>(PerformVoteDocument, baseOptions);
      }
export type PerformVoteMutationHookResult = ReturnType<typeof usePerformVoteMutation>;
export type PerformVoteMutationResult = ApolloReactCommon.MutationResult<PerformVoteMutation>;
export type PerformVoteMutationOptions = ApolloReactCommon.BaseMutationOptions<PerformVoteMutation, PerformVoteMutationVariables>;