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
  schoolList?: Maybe<Array<Maybe<SchoolType>>>,
  school?: Maybe<SchoolType>,
  userList?: Maybe<Array<Maybe<UserTypePublic>>>,
  user?: Maybe<UserTypePublic>,
  userMe?: Maybe<UserTypePrivate>,
};


export type QuerySchoolArgs = {
  id?: Maybe<Scalars['Int']>
};


export type QueryUserArgs = {
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

export type SchoolType = {
   __typename?: 'SchoolType',
  id: Scalars['ID'],
  schoolType?: Maybe<Scalars['String']>,
  name: Scalars['String'],
  city: Scalars['String'],
  country: Scalars['String'],
  modified: Scalars['DateTime'],
  created: Scalars['DateTime'],
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

export type SchoolQueryVariables = {};


export type SchoolQuery = (
  { __typename?: 'Query' }
  & { school: Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'name'>
  )> }
);

export type SchoolListQueryVariables = {};


export type SchoolListQuery = (
  { __typename?: 'Query' }
  & { schoolList: Maybe<Array<Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'name'>
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
    & Pick<UserTypePublic, 'id' | 'username' | 'title' | 'bio' | 'points' | 'created'>
  )> }
);

export type UserListQueryVariables = {};


export type UserListQuery = (
  { __typename?: 'Query' }
  & { userList: Maybe<Array<Maybe<(
    { __typename?: 'UserTypePublic' }
    & Pick<UserTypePublic, 'id' | 'username' | 'points'>
  )>>> }
);

export type UserMeQueryVariables = {};


export type UserMeQuery = (
  { __typename?: 'Query' }
  & { userMe: Maybe<(
    { __typename?: 'UserTypePrivate' }
    & Pick<UserTypePrivate, 'id' | 'username' | 'email' | 'title' | 'bio' | 'avatar' | 'points' | 'language'>
  )> }
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
    query School {
  school {
    name
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
export const SchoolListDocument = gql`
    query SchoolList {
  schoolList {
    name
  }
}
    `;

    export function useSchoolListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SchoolListQuery, SchoolListQueryVariables>) {
      return ApolloReactHooks.useQuery<SchoolListQuery, SchoolListQueryVariables>(SchoolListDocument, baseOptions);
    }
      export function useSchoolListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SchoolListQuery, SchoolListQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<SchoolListQuery, SchoolListQueryVariables>(SchoolListDocument, baseOptions);
      }
      
export type SchoolListQueryHookResult = ReturnType<typeof useSchoolListQuery>;
export type SchoolListQueryResult = ApolloReactCommon.QueryResult<SchoolListQuery, SchoolListQueryVariables>;
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
export const UserListDocument = gql`
    query UserList {
  userList {
    id
    username
    points
  }
}
    `;

    export function useUserListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserListQuery, UserListQueryVariables>) {
      return ApolloReactHooks.useQuery<UserListQuery, UserListQueryVariables>(UserListDocument, baseOptions);
    }
      export function useUserListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserListQuery, UserListQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<UserListQuery, UserListQueryVariables>(UserListDocument, baseOptions);
      }
      
export type UserListQueryHookResult = ReturnType<typeof useUserListQuery>;
export type UserListQueryResult = ApolloReactCommon.QueryResult<UserListQuery, UserListQueryVariables>;
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