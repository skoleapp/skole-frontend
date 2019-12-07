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
 * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
 **/
  Date: any,
  /** 
 * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
 **/
  DateTime: any,
};

export type ChangePasswordMutationInput = {
  oldPassword: Scalars['String'],
  newPassword: Scalars['String'],
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type ChangePasswordMutationPayload = {
   __typename?: 'ChangePasswordMutationPayload',
  user?: Maybe<UserTypeChangePassword>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type CourseType = {
   __typename?: 'CourseType',
  id: Scalars['ID'],
  name: Scalars['String'],
  code?: Maybe<Scalars['String']>,
  subject: SubjectType,
  school: SchoolType,
  creator?: Maybe<UserTypePublic>,
  modified: Scalars['DateTime'],
  created: Scalars['DateTime'],
  resources?: Maybe<Array<Maybe<ResourceType>>>,
  points?: Maybe<Scalars['Int']>,
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
  user?: Maybe<UserTypePrivate>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  message?: Maybe<Scalars['String']>,
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
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type LoginMutationPayload = {
   __typename?: 'LoginMutationPayload',
  user?: Maybe<UserTypePrivate>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  token?: Maybe<Scalars['String']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type Mutation = {
   __typename?: 'Mutation',
  createCourse?: Maybe<CreateCourseMutationPayload>,
  register?: Maybe<RegisterMutationPayload>,
  login?: Maybe<LoginMutationPayload>,
  updateUser?: Maybe<UpdateUserMutationPayload>,
  changePassword?: Maybe<ChangePasswordMutationPayload>,
  deleteUser?: Maybe<DeleteUserMutationPayload>,
};


export type MutationCreateCourseArgs = {
  input: CreateCourseMutationInput
};


export type MutationRegisterArgs = {
  input: RegisterMutationInput
};


export type MutationLoginArgs = {
  input: LoginMutationInput
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

export type Query = {
   __typename?: 'Query',
  resourceTypes?: Maybe<Array<Maybe<ResourceTypeObjectType>>>,
  resource?: Maybe<ResourceType>,
  leaderboard?: Maybe<Array<Maybe<UserTypePublic>>>,
  user?: Maybe<UserTypePublic>,
  userMe?: Maybe<UserTypePrivate>,
  subjects?: Maybe<Array<Maybe<SubjectType>>>,
  schoolTypes?: Maybe<Array<Maybe<SchoolTypeObjectType>>>,
  schools?: Maybe<Array<Maybe<SchoolType>>>,
  school?: Maybe<SchoolType>,
  courses?: Maybe<Array<Maybe<CourseType>>>,
  course?: Maybe<CourseType>,
};


export type QueryResourceArgs = {
  resourceId: Scalars['Int']
};


export type QueryUserArgs = {
  userId: Scalars['Int']
};


export type QuerySubjectsArgs = {
  schoolId?: Maybe<Scalars['String']>
};


export type QuerySchoolsArgs = {
  schoolType?: Maybe<Scalars['String']>,
  schoolName?: Maybe<Scalars['String']>,
  schoolCity?: Maybe<Scalars['String']>,
  schoolCountry?: Maybe<Scalars['String']>
};


export type QuerySchoolArgs = {
  schoolId?: Maybe<Scalars['Int']>
};


export type QueryCoursesArgs = {
  courseName?: Maybe<Scalars['String']>,
  courseCode?: Maybe<Scalars['String']>,
  subjectId?: Maybe<Scalars['Int']>,
  schoolId?: Maybe<Scalars['Int']>
};


export type QueryCourseArgs = {
  courseId?: Maybe<Scalars['Int']>
};

export type RegisterMutationInput = {
  username: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String'],
  id?: Maybe<Scalars['ID']>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type RegisterMutationPayload = {
   __typename?: 'RegisterMutationPayload',
  user?: Maybe<UserTypeRegister>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type ResourceType = {
   __typename?: 'ResourceType',
  id: Scalars['ID'],
  resourceType?: Maybe<Scalars['String']>,
  title: Scalars['String'],
  file: Scalars['String'],
  date: Scalars['Date'],
  creator?: Maybe<UserTypePublic>,
  modified: Scalars['DateTime'],
  created: Scalars['DateTime'],
  points?: Maybe<Scalars['Int']>,
};

export type ResourceTypeObjectType = {
   __typename?: 'ResourceTypeObjectType',
  name: Scalars['String'],
};

export type SchoolType = {
   __typename?: 'SchoolType',
  id: Scalars['ID'],
  schoolType?: Maybe<Scalars['String']>,
  name: Scalars['String'],
  city?: Maybe<Scalars['String']>,
  country?: Maybe<Scalars['String']>,
  subjects?: Maybe<Array<Maybe<SubjectType>>>,
  courses?: Maybe<Array<Maybe<CourseType>>>,
};

export type SchoolTypeObjectType = {
   __typename?: 'SchoolTypeObjectType',
  name: Scalars['String'],
};

export type SubjectType = {
   __typename?: 'SubjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
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
  user?: Maybe<UserTypePrivate>,
  errors?: Maybe<Array<Maybe<ErrorType>>>,
  clientMutationId?: Maybe<Scalars['String']>,
};

export type UserTypeChangePassword = {
   __typename?: 'UserTypeChangePassword',
  id: Scalars['ID'],
  modified: Scalars['DateTime'],
};

export type UserTypePrivate = {
   __typename?: 'UserTypePrivate',
  id: Scalars['ID'],
  created: Scalars['DateTime'],
  username: Scalars['String'],
  title?: Maybe<Scalars['String']>,
  bio?: Maybe<Scalars['String']>,
  avatar?: Maybe<Scalars['String']>,
  email: Scalars['String'],
  schools: Array<SchoolType>,
  avatarThumbnail?: Maybe<Scalars['String']>,
  points?: Maybe<Scalars['Int']>,
};

export type UserTypePublic = {
   __typename?: 'UserTypePublic',
  id: Scalars['ID'],
  created: Scalars['DateTime'],
  username: Scalars['String'],
  title?: Maybe<Scalars['String']>,
  bio?: Maybe<Scalars['String']>,
  avatar?: Maybe<Scalars['String']>,
  avatarThumbnail?: Maybe<Scalars['String']>,
  points?: Maybe<Scalars['Int']>,
};

export type UserTypeRegister = {
   __typename?: 'UserTypeRegister',
  id: Scalars['ID'],
  created: Scalars['DateTime'],
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
      { __typename?: 'UserTypeRegister' }
      & Pick<UserTypeRegister, 'id' | 'created'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )>, login: Maybe<(
    { __typename?: 'LoginMutationPayload' }
    & Pick<LoginMutationPayload, 'token'>
    & { user: Maybe<(
      { __typename?: 'UserTypePrivate' }
      & Pick<UserTypePrivate, 'id' | 'title' | 'bio' | 'avatar' | 'points' | 'created' | 'email'>
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
      { __typename?: 'UserTypePrivate' }
      & Pick<UserTypePrivate, 'id' | 'title' | 'bio' | 'avatar' | 'points' | 'created' | 'email'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
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
      { __typename?: 'UserTypePrivate' }
      & Pick<UserTypePrivate, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'points' | 'created'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
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

export type CreateCourseMutationVariables = {
  courseName: Scalars['String'],
  courseCode?: Maybe<Scalars['String']>,
  subjectId: Scalars['ID'],
  schoolId: Scalars['ID']
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

export type UserMeQueryVariables = {};


export type UserMeQuery = (
  { __typename?: 'Query' }
  & { userMe: Maybe<(
    { __typename?: 'UserTypePrivate' }
    & Pick<UserTypePrivate, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'points'>
  )> }
);

export type LeaderboardQueryVariables = {};


export type LeaderboardQuery = (
  { __typename?: 'Query' }
  & { leaderboard: Maybe<Array<Maybe<(
    { __typename?: 'UserTypePublic' }
    & Pick<UserTypePublic, 'id' | 'username' | 'points' | 'avatar'>
  )>>> }
);

export type UserQueryVariables = {
  userId: Scalars['Int']
};


export type UserQuery = (
  { __typename?: 'Query' }
  & { user: Maybe<(
    { __typename?: 'UserTypePublic' }
    & Pick<UserTypePublic, 'id' | 'username' | 'title' | 'bio' | 'avatar' | 'points' | 'created'>
  )> }
);

export type FilterSchoolsQueryVariables = {
  schoolType?: Maybe<Scalars['String']>,
  schoolName?: Maybe<Scalars['String']>,
  schoolCity?: Maybe<Scalars['String']>,
  schoolCountry?: Maybe<Scalars['String']>
};


export type FilterSchoolsQuery = (
  { __typename?: 'Query' }
  & { schools: Maybe<Array<Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'id' | 'schoolType' | 'name'>
  )>>>, schoolTypes: Maybe<Array<Maybe<(
    { __typename?: 'SchoolTypeObjectType' }
    & Pick<SchoolTypeObjectType, 'name'>
  )>>> }
);

export type SchoolQueryVariables = {
  schoolId?: Maybe<Scalars['Int']>
};


export type SchoolQuery = (
  { __typename?: 'Query' }
  & { school: Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'id' | 'schoolType' | 'name' | 'city' | 'country'>
    & { courses: Maybe<Array<Maybe<(
      { __typename?: 'CourseType' }
      & Pick<CourseType, 'id' | 'name'>
    )>>>, subjects: Maybe<Array<Maybe<(
      { __typename?: 'SubjectType' }
      & Pick<SubjectType, 'id' | 'name'>
    )>>> }
  )> }
);

export type SchoolTypesQueryVariables = {};


export type SchoolTypesQuery = (
  { __typename?: 'Query' }
  & { schoolTypes: Maybe<Array<Maybe<(
    { __typename?: 'SchoolTypeObjectType' }
    & Pick<SchoolTypeObjectType, 'name'>
  )>>> }
);

export type FilterSubjectsQueryVariables = {
  schoolId?: Maybe<Scalars['String']>
};


export type FilterSubjectsQuery = (
  { __typename?: 'Query' }
  & { subjects: Maybe<Array<Maybe<(
    { __typename?: 'SubjectType' }
    & Pick<SubjectType, 'id' | 'name'>
  )>>>, schools: Maybe<Array<Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'id' | 'name'>
  )>>> }
);

export type FilterCoursesQueryVariables = {
  courseName?: Maybe<Scalars['String']>,
  courseCode?: Maybe<Scalars['String']>,
  schoolId?: Maybe<Scalars['Int']>,
  subjectId?: Maybe<Scalars['Int']>
};


export type FilterCoursesQuery = (
  { __typename?: 'Query' }
  & { courses: Maybe<Array<Maybe<(
    { __typename?: 'CourseType' }
    & Pick<CourseType, 'id' | 'name' | 'code'>
  )>>>, schools: Maybe<Array<Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'id' | 'name'>
  )>>>, subjects: Maybe<Array<Maybe<(
    { __typename?: 'SubjectType' }
    & Pick<SubjectType, 'id' | 'name'>
  )>>> }
);

export type CourseQueryVariables = {
  courseId: Scalars['Int']
};


export type CourseQuery = (
  { __typename?: 'Query' }
  & { course: Maybe<(
    { __typename?: 'CourseType' }
    & Pick<CourseType, 'id' | 'name' | 'code' | 'modified' | 'created' | 'points'>
    & { subject: (
      { __typename?: 'SubjectType' }
      & Pick<SubjectType, 'id' | 'name'>
    ), school: (
      { __typename?: 'SchoolType' }
      & Pick<SchoolType, 'id' | 'name'>
    ), creator: Maybe<(
      { __typename?: 'UserTypePublic' }
      & Pick<UserTypePublic, 'id' | 'username'>
    )>, resources: Maybe<Array<Maybe<(
      { __typename?: 'ResourceType' }
      & Pick<ResourceType, 'id' | 'title' | 'points'>
    )>>> }
  )> }
);

export type ResourceTypesQueryVariables = {};


export type ResourceTypesQuery = (
  { __typename?: 'Query' }
  & { resourceTypes: Maybe<Array<Maybe<(
    { __typename?: 'ResourceTypeObjectType' }
    & Pick<ResourceTypeObjectType, 'name'>
  )>>> }
);

export type UploadResourceFormDataQueryVariables = {};


export type UploadResourceFormDataQuery = (
  { __typename?: 'Query' }
  & { resourceTypes: Maybe<Array<Maybe<(
    { __typename?: 'ResourceTypeObjectType' }
    & Pick<ResourceTypeObjectType, 'name'>
  )>>>, courses: Maybe<Array<Maybe<(
    { __typename?: 'CourseType' }
    & Pick<CourseType, 'id' | 'name'>
  )>>> }
);

export type CreateCourseFormDataQueryVariables = {};


export type CreateCourseFormDataQuery = (
  { __typename?: 'Query' }
  & { subjects: Maybe<Array<Maybe<(
    { __typename?: 'SubjectType' }
    & Pick<SubjectType, 'id' | 'name'>
  )>>>, schools: Maybe<Array<Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'id' | 'name'>
  )>>> }
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
export const CreateCourseDocument = gql`
    mutation CreateCourse($courseName: String!, $courseCode: String, $subjectId: ID!, $schoolId: ID!) {
  createCourse(input: {name: $courseName, code: $courseCode, subject: $subjectId, school: $schoolId}) {
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
export const LeaderboardDocument = gql`
    query Leaderboard {
  leaderboard {
    id
    username
    points
    avatar
  }
}
    `;

    export function useLeaderboardQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<LeaderboardQuery, LeaderboardQueryVariables>) {
      return ApolloReactHooks.useQuery<LeaderboardQuery, LeaderboardQueryVariables>(LeaderboardDocument, baseOptions);
    }
      export function useLeaderboardLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<LeaderboardQuery, LeaderboardQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<LeaderboardQuery, LeaderboardQueryVariables>(LeaderboardDocument, baseOptions);
      }
      
export type LeaderboardQueryHookResult = ReturnType<typeof useLeaderboardQuery>;
export type LeaderboardQueryResult = ApolloReactCommon.QueryResult<LeaderboardQuery, LeaderboardQueryVariables>;
export const UserDocument = gql`
    query User($userId: Int!) {
  user(userId: $userId) {
    id
    username
    title
    bio
    avatar
    points
    created
  }
}
    `;

    export function useUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserQuery, UserQueryVariables>) {
      return ApolloReactHooks.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
    }
      export function useUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
      
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserQueryResult = ApolloReactCommon.QueryResult<UserQuery, UserQueryVariables>;
export const FilterSchoolsDocument = gql`
    query FilterSchools($schoolType: String, $schoolName: String, $schoolCity: String, $schoolCountry: String) {
  schools(schoolType: $schoolType, schoolName: $schoolName, schoolCity: $schoolCity, schoolCountry: $schoolCountry) {
    id
    schoolType
    name
  }
  schoolTypes {
    name
  }
}
    `;

    export function useFilterSchoolsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FilterSchoolsQuery, FilterSchoolsQueryVariables>) {
      return ApolloReactHooks.useQuery<FilterSchoolsQuery, FilterSchoolsQueryVariables>(FilterSchoolsDocument, baseOptions);
    }
      export function useFilterSchoolsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FilterSchoolsQuery, FilterSchoolsQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<FilterSchoolsQuery, FilterSchoolsQueryVariables>(FilterSchoolsDocument, baseOptions);
      }
      
export type FilterSchoolsQueryHookResult = ReturnType<typeof useFilterSchoolsQuery>;
export type FilterSchoolsQueryResult = ApolloReactCommon.QueryResult<FilterSchoolsQuery, FilterSchoolsQueryVariables>;
export const SchoolDocument = gql`
    query School($schoolId: Int) {
  school(schoolId: $schoolId) {
    id
    schoolType
    name
    city
    country
    courses {
      id
      name
    }
    subjects {
      id
      name
    }
  }
}
    `;

    export function useSchoolQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SchoolQuery, SchoolQueryVariables>) {
      return ApolloReactHooks.useQuery<SchoolQuery, SchoolQueryVariables>(SchoolDocument, baseOptions);
    }
      export function useSchoolLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SchoolQuery, SchoolQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<SchoolQuery, SchoolQueryVariables>(SchoolDocument, baseOptions);
      }
      
export type SchoolQueryHookResult = ReturnType<typeof useSchoolQuery>;
export type SchoolQueryResult = ApolloReactCommon.QueryResult<SchoolQuery, SchoolQueryVariables>;
export const SchoolTypesDocument = gql`
    query SchoolTypes {
  schoolTypes {
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
export const FilterSubjectsDocument = gql`
    query FilterSubjects($schoolId: String) {
  subjects(schoolId: $schoolId) {
    id
    name
  }
  schools {
    id
    name
  }
}
    `;

    export function useFilterSubjectsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FilterSubjectsQuery, FilterSubjectsQueryVariables>) {
      return ApolloReactHooks.useQuery<FilterSubjectsQuery, FilterSubjectsQueryVariables>(FilterSubjectsDocument, baseOptions);
    }
      export function useFilterSubjectsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FilterSubjectsQuery, FilterSubjectsQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<FilterSubjectsQuery, FilterSubjectsQueryVariables>(FilterSubjectsDocument, baseOptions);
      }
      
export type FilterSubjectsQueryHookResult = ReturnType<typeof useFilterSubjectsQuery>;
export type FilterSubjectsQueryResult = ApolloReactCommon.QueryResult<FilterSubjectsQuery, FilterSubjectsQueryVariables>;
export const FilterCoursesDocument = gql`
    query FilterCourses($courseName: String, $courseCode: String, $schoolId: Int, $subjectId: Int) {
  courses(courseName: $courseName, courseCode: $courseCode, schoolId: $schoolId, subjectId: $subjectId) {
    id
    name
    code
  }
  schools {
    id
    name
  }
  subjects {
    id
    name
  }
}
    `;

    export function useFilterCoursesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FilterCoursesQuery, FilterCoursesQueryVariables>) {
      return ApolloReactHooks.useQuery<FilterCoursesQuery, FilterCoursesQueryVariables>(FilterCoursesDocument, baseOptions);
    }
      export function useFilterCoursesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FilterCoursesQuery, FilterCoursesQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<FilterCoursesQuery, FilterCoursesQueryVariables>(FilterCoursesDocument, baseOptions);
      }
      
export type FilterCoursesQueryHookResult = ReturnType<typeof useFilterCoursesQuery>;
export type FilterCoursesQueryResult = ApolloReactCommon.QueryResult<FilterCoursesQuery, FilterCoursesQueryVariables>;
export const CourseDocument = gql`
    query Course($courseId: Int!) {
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
  }
}
    `;

    export function useCourseQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CourseQuery, CourseQueryVariables>) {
      return ApolloReactHooks.useQuery<CourseQuery, CourseQueryVariables>(CourseDocument, baseOptions);
    }
      export function useCourseLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CourseQuery, CourseQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<CourseQuery, CourseQueryVariables>(CourseDocument, baseOptions);
      }
      
export type CourseQueryHookResult = ReturnType<typeof useCourseQuery>;
export type CourseQueryResult = ApolloReactCommon.QueryResult<CourseQuery, CourseQueryVariables>;
export const ResourceTypesDocument = gql`
    query ResourceTypes {
  resourceTypes {
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
export const UploadResourceFormDataDocument = gql`
    query UploadResourceFormData {
  resourceTypes {
    name
  }
  courses {
    id
    name
  }
}
    `;

    export function useUploadResourceFormDataQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UploadResourceFormDataQuery, UploadResourceFormDataQueryVariables>) {
      return ApolloReactHooks.useQuery<UploadResourceFormDataQuery, UploadResourceFormDataQueryVariables>(UploadResourceFormDataDocument, baseOptions);
    }
      export function useUploadResourceFormDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UploadResourceFormDataQuery, UploadResourceFormDataQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<UploadResourceFormDataQuery, UploadResourceFormDataQueryVariables>(UploadResourceFormDataDocument, baseOptions);
      }
      
export type UploadResourceFormDataQueryHookResult = ReturnType<typeof useUploadResourceFormDataQuery>;
export type UploadResourceFormDataQueryResult = ApolloReactCommon.QueryResult<UploadResourceFormDataQuery, UploadResourceFormDataQueryVariables>;
export const CreateCourseFormDataDocument = gql`
    query CreateCourseFormData {
  subjects {
    id
    name
  }
  schools {
    id
    name
  }
}
    `;

    export function useCreateCourseFormDataQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CreateCourseFormDataQuery, CreateCourseFormDataQueryVariables>) {
      return ApolloReactHooks.useQuery<CreateCourseFormDataQuery, CreateCourseFormDataQueryVariables>(CreateCourseFormDataDocument, baseOptions);
    }
      export function useCreateCourseFormDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CreateCourseFormDataQuery, CreateCourseFormDataQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<CreateCourseFormDataQuery, CreateCourseFormDataQueryVariables>(CreateCourseFormDataDocument, baseOptions);
      }
      
export type CreateCourseFormDataQueryHookResult = ReturnType<typeof useCreateCourseFormDataQuery>;
export type CreateCourseFormDataQueryResult = ApolloReactCommon.QueryResult<CreateCourseFormDataQuery, CreateCourseFormDataQueryVariables>;