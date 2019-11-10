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
};



export type DeleteUserMutation = {
   __typename?: 'DeleteUserMutation',
  message?: Maybe<Scalars['String']>,
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
  register?: Maybe<RegisterMutationPayload>,
  login?: Maybe<LoginMutationPayload>,
  updateUser?: Maybe<UpdateUserMutationPayload>,
  changePassword?: Maybe<ChangePasswordMutationPayload>,
  deleteUser?: Maybe<DeleteUserMutation>,
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

export type Query = {
   __typename?: 'Query',
  users?: Maybe<Array<Maybe<UserTypePublic>>>,
  user?: Maybe<UserTypePublic>,
  userMe?: Maybe<UserTypePrivate>,
  subjectList?: Maybe<Array<Maybe<SubjectType>>>,
  subject?: Maybe<SubjectType>,
  schools?: Maybe<Array<Maybe<SchoolType>>>,
  school?: Maybe<SchoolType>,
  courseList?: Maybe<Array<Maybe<CourseType>>>,
  course?: Maybe<CourseType>,
};


export type QueryUserArgs = {
  id: Scalars['Int']
};


export type QuerySubjectArgs = {
  id?: Maybe<Scalars['Int']>
};


export type QuerySchoolArgs = {
  id: Scalars['Int']
};


export type QueryCourseArgs = {
  id?: Maybe<Scalars['Int']>
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

/** An enumeration. */
export enum ResourceResourceType {
  /** exam */
  Exam = 'EXAM',
  /** note */
  Note = 'NOTE',
  /** exercise */
  Exercise = 'EXERCISE',
  /** other */
  Other = 'OTHER'
}

export type ResourceType = {
   __typename?: 'ResourceType',
  id: Scalars['ID'],
  resourceType: ResourceResourceType,
  title: Scalars['String'],
  file: Scalars['String'],
  date?: Maybe<Scalars['Date']>,
  course: CourseType,
  creator?: Maybe<UserTypePublic>,
  points: Scalars['Int'],
  modified: Scalars['DateTime'],
  created: Scalars['DateTime'],
};

export type SchoolType = {
   __typename?: 'SchoolType',
  id: Scalars['ID'],
  schoolType?: Maybe<Scalars['String']>,
  name: Scalars['String'],
  city: Scalars['String'],
  country: Scalars['String'],
  subjects: Array<SubjectType>,
};

export type SubjectType = {
   __typename?: 'SubjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
  schools: Array<SchoolType>,
};

export type UpdateUserMutationInput = {
  username: Scalars['String'],
  email: Scalars['String'],
  title?: Maybe<Scalars['String']>,
  bio?: Maybe<Scalars['String']>,
  avatar?: Maybe<Scalars['String']>,
  language: Scalars['String'],
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
  points: Scalars['Int'],
  email: Scalars['String'],
  language?: Maybe<Scalars['String']>,
  schools: Array<SchoolType>,
};

export type UserTypePublic = {
   __typename?: 'UserTypePublic',
  id: Scalars['ID'],
  created: Scalars['DateTime'],
  username: Scalars['String'],
  title?: Maybe<Scalars['String']>,
  bio?: Maybe<Scalars['String']>,
  avatar?: Maybe<Scalars['String']>,
  points: Scalars['Int'],
};

export type UserTypeRegister = {
   __typename?: 'UserTypeRegister',
  id: Scalars['ID'],
  created: Scalars['DateTime'],
};

export type ChangePasswordMutationVariables = {
  oldPassword: Scalars['String'],
  newPassword: Scalars['String']
};


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: Maybe<(
    { __typename?: 'ChangePasswordMutationPayload' }
    & { user: Maybe<(
      { __typename?: 'UserTypeChangePassword' }
      & Pick<UserTypeChangePassword, 'id' | 'modified'>
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
  & { login: Maybe<(
    { __typename?: 'LoginMutationPayload' }
    & Pick<LoginMutationPayload, 'token'>
    & { user: Maybe<(
      { __typename?: 'UserTypePrivate' }
      & Pick<UserTypePrivate, 'id' | 'title' | 'bio' | 'points' | 'created' | 'email' | 'language'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type SignUpMutationVariables = {
  username: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String']
};


export type SignUpMutation = (
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
      & Pick<UserTypePrivate, 'id' | 'title' | 'bio' | 'points' | 'created' | 'email' | 'language'>
    )> }
  )> }
);

export type SchoolQueryVariables = {
  id: Scalars['Int']
};


export type SchoolQuery = (
  { __typename?: 'Query' }
  & { school: Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'schoolType' | 'name' | 'city' | 'country'>
  )> }
);

export type SchoolsQueryVariables = {};


export type SchoolsQuery = (
  { __typename?: 'Query' }
  & { schools: Maybe<Array<Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'id' | 'schoolType' | 'name'>
  )>>> }
);

export type UpdateUserMutationVariables = {
  username: Scalars['String'],
  email: Scalars['String'],
  title?: Maybe<Scalars['String']>,
  bio?: Maybe<Scalars['String']>,
  avatar?: Maybe<Scalars['String']>,
  language: Scalars['String']
};


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: Maybe<(
    { __typename?: 'UpdateUserMutationPayload' }
    & { user: Maybe<(
      { __typename?: 'UserTypePrivate' }
      & Pick<UserTypePrivate, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'points' | 'language' | 'created'>
    )>, errors: Maybe<Array<Maybe<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'messages'>
    )>>> }
  )> }
);

export type UserQueryVariables = {
  id: Scalars['Int']
};


export type UserQuery = (
  { __typename?: 'Query' }
  & { user: Maybe<(
    { __typename?: 'UserTypePublic' }
    & Pick<UserTypePublic, 'id' | 'username' | 'title' | 'bio' | 'avatar' | 'points' | 'created'>
  )> }
);

export type UserMeQueryVariables = {};


export type UserMeQuery = (
  { __typename?: 'Query' }
  & { userMe: Maybe<(
    { __typename?: 'UserTypePrivate' }
    & Pick<UserTypePrivate, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'points' | 'language'>
  )> }
);

export type UsersQueryVariables = {};


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Maybe<Array<Maybe<(
    { __typename?: 'UserTypePublic' }
    & Pick<UserTypePublic, 'id' | 'username' | 'points' | 'avatar'>
  )>>> }
);


export const ChangePasswordDocument = gql`
    mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
  changePassword(input: {oldPassword: $oldPassword, newPassword: $newPassword}) {
    user {
      id
      modified
    }
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
export const SignInDocument = gql`
    mutation SignIn($usernameOrEmail: String!, $password: String!) {
  login(input: {usernameOrEmail: $usernameOrEmail, password: $password}) {
    token
    user {
      id
      title
      bio
      points
      created
      email
      language
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
export const SignUpDocument = gql`
    mutation SignUp($username: String!, $email: String!, $password: String!) {
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
      points
      created
      email
      language
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
export const SchoolDocument = gql`
    query School($id: Int!) {
  school(id: $id) {
    schoolType
    name
    city
    country
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
export const SchoolsDocument = gql`
    query Schools {
  schools {
    id
    schoolType
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
export const UpdateUserDocument = gql`
    mutation UpdateUser($username: String!, $email: String!, $title: String, $bio: String, $avatar: String, $language: String!) {
  updateUser(input: {username: $username, email: $email, title: $title, bio: $bio, avatar: $avatar, language: $language}) {
    user {
      id
      username
      email
      title
      bio
      avatar
      points
      language
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
export const UserDocument = gql`
    query User($id: Int!) {
  user(id: $id) {
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
    language
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
export const UsersDocument = gql`
    query Users {
  users {
    id
    username
    points
    avatar
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