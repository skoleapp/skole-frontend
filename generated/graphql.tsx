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
  points: Scalars['Int'],
  modified: Scalars['DateTime'],
  created: Scalars['DateTime'],
  resources?: Maybe<Array<Maybe<ResourceType>>>,
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
  createCourse?: Maybe<CreateCourseMutationPayload>,
  register?: Maybe<RegisterMutationPayload>,
  login?: Maybe<LoginMutationPayload>,
  updateUser?: Maybe<UpdateUserMutationPayload>,
  changePassword?: Maybe<ChangePasswordMutationPayload>,
  deleteUser?: Maybe<DeleteUserMutation>,
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

export type Query = {
   __typename?: 'Query',
  users?: Maybe<Array<Maybe<UserTypePublic>>>,
  user?: Maybe<UserTypePublic>,
  userMe?: Maybe<UserTypePrivate>,
  subjects?: Maybe<Array<Maybe<SubjectType>>>,
  subject?: Maybe<SubjectType>,
  schools?: Maybe<Array<Maybe<SchoolType>>>,
  school?: Maybe<SchoolType>,
  courses?: Maybe<Array<Maybe<CourseType>>>,
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


export type QueryCoursesArgs = {
  subjectId?: Maybe<Scalars['Int']>
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
  subjects?: Maybe<Array<Maybe<SubjectType>>>,
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
      & Pick<UserTypePrivate, 'id' | 'title' | 'bio' | 'avatar' | 'points' | 'created' | 'email' | 'language'>
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
      & Pick<UserTypePrivate, 'id' | 'title' | 'bio' | 'avatar' | 'points' | 'created' | 'email' | 'language'>
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

export type CreateCourseMutationVariables = {
  name: Scalars['String'],
  code?: Maybe<Scalars['String']>,
  subject: Scalars['ID'],
  school: Scalars['ID']
};


export type CreateCourseMutation = (
  { __typename?: 'Mutation' }
  & { createCourse: Maybe<(
    { __typename?: 'CreateCourseMutationPayload' }
    & { course: Maybe<(
      { __typename?: 'CourseType' }
      & Pick<CourseType, 'id' | 'name'>
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

export type SchoolsQueryVariables = {};


export type SchoolsQuery = (
  { __typename?: 'Query' }
  & { schools: Maybe<Array<Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'id' | 'schoolType' | 'name'>
  )>>> }
);

export type SchoolQueryVariables = {
  id: Scalars['Int']
};


export type SchoolQuery = (
  { __typename?: 'Query' }
  & { school: Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'id' | 'schoolType' | 'name' | 'city' | 'country'>
  )> }
);

export type SchoolSubjectsQueryVariables = {
  id: Scalars['Int']
};


export type SchoolSubjectsQuery = (
  { __typename?: 'Query' }
  & { school: Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'id' | 'schoolType' | 'name'>
    & { subjects: Maybe<Array<Maybe<(
      { __typename?: 'SubjectType' }
      & Pick<SubjectType, 'id' | 'name'>
    )>>> }
  )> }
);

export type SchoolCoursesQueryVariables = {
  id: Scalars['Int'],
  subjectId?: Maybe<Scalars['Int']>
};


export type SchoolCoursesQuery = (
  { __typename?: 'Query' }
  & { school: Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'id' | 'name'>
  )>, subjects: Maybe<Array<Maybe<(
    { __typename?: 'SubjectType' }
    & Pick<SubjectType, 'id' | 'name'>
  )>>>, courses: Maybe<Array<Maybe<(
    { __typename?: 'CourseType' }
    & Pick<CourseType, 'name' | 'code'>
    & { subject: (
      { __typename?: 'SubjectType' }
      & Pick<SubjectType, 'name'>
    ) }
  )>>> }
);

export type CourseQueryVariables = {
  id: Scalars['Int']
};


export type CourseQuery = (
  { __typename?: 'Query' }
  & { course: Maybe<(
    { __typename?: 'CourseType' }
    & Pick<CourseType, 'name' | 'code' | 'modified' | 'created'>
    & { subject: (
      { __typename?: 'SubjectType' }
      & Pick<SubjectType, 'name'>
    ), school: (
      { __typename?: 'SchoolType' }
      & Pick<SchoolType, 'name'>
    ), creator: Maybe<(
      { __typename?: 'UserTypePublic' }
      & Pick<UserTypePublic, 'username'>
    )>, resources: Maybe<Array<Maybe<(
      { __typename?: 'ResourceType' }
      & Pick<ResourceType, 'id' | 'resourceType' | 'title'>
    )>>> }
  )> }
);

export type SchoolsAndSubjectsQueryVariables = {};


export type SchoolsAndSubjectsQuery = (
  { __typename?: 'Query' }
  & { schools: Maybe<Array<Maybe<(
    { __typename?: 'SchoolType' }
    & Pick<SchoolType, 'id' | 'name'>
  )>>>, subjects: Maybe<Array<Maybe<(
    { __typename?: 'SubjectType' }
    & Pick<SubjectType, 'id' | 'name'>
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
      language
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
      language
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
export const CreateCourseDocument = gql`
    mutation CreateCourse($name: String!, $code: String, $subject: ID!, $school: ID!) {
  createCourse(input: {name: $name, code: $code, subject: $subject, school: $school}) {
    course {
      id
      name
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
export const SchoolDocument = gql`
    query School($id: Int!) {
  school(id: $id) {
    id
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
export const SchoolSubjectsDocument = gql`
    query SchoolSubjects($id: Int!) {
  school(id: $id) {
    id
    schoolType
    name
    subjects {
      id
      name
    }
  }
}
    `;

    export function useSchoolSubjectsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SchoolSubjectsQuery, SchoolSubjectsQueryVariables>) {
      return ApolloReactHooks.useQuery<SchoolSubjectsQuery, SchoolSubjectsQueryVariables>(SchoolSubjectsDocument, baseOptions);
    }
      export function useSchoolSubjectsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SchoolSubjectsQuery, SchoolSubjectsQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<SchoolSubjectsQuery, SchoolSubjectsQueryVariables>(SchoolSubjectsDocument, baseOptions);
      }
      
export type SchoolSubjectsQueryHookResult = ReturnType<typeof useSchoolSubjectsQuery>;
export type SchoolSubjectsQueryResult = ApolloReactCommon.QueryResult<SchoolSubjectsQuery, SchoolSubjectsQueryVariables>;
export const SchoolCoursesDocument = gql`
    query SchoolCourses($id: Int!, $subjectId: Int) {
  school(id: $id) {
    id
    name
  }
  subjects {
    id
    name
  }
  courses(subjectId: $subjectId) {
    name
    code
    subject {
      name
    }
  }
}
    `;

    export function useSchoolCoursesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SchoolCoursesQuery, SchoolCoursesQueryVariables>) {
      return ApolloReactHooks.useQuery<SchoolCoursesQuery, SchoolCoursesQueryVariables>(SchoolCoursesDocument, baseOptions);
    }
      export function useSchoolCoursesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SchoolCoursesQuery, SchoolCoursesQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<SchoolCoursesQuery, SchoolCoursesQueryVariables>(SchoolCoursesDocument, baseOptions);
      }
      
export type SchoolCoursesQueryHookResult = ReturnType<typeof useSchoolCoursesQuery>;
export type SchoolCoursesQueryResult = ApolloReactCommon.QueryResult<SchoolCoursesQuery, SchoolCoursesQueryVariables>;
export const CourseDocument = gql`
    query Course($id: Int!) {
  course(id: $id) {
    name
    code
    subject {
      name
    }
    school {
      name
    }
    creator {
      username
    }
    modified
    created
    resources {
      id
      resourceType
      title
    }
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
export const SchoolsAndSubjectsDocument = gql`
    query SchoolsAndSubjects {
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

    export function useSchoolsAndSubjectsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SchoolsAndSubjectsQuery, SchoolsAndSubjectsQueryVariables>) {
      return ApolloReactHooks.useQuery<SchoolsAndSubjectsQuery, SchoolsAndSubjectsQueryVariables>(SchoolsAndSubjectsDocument, baseOptions);
    }
      export function useSchoolsAndSubjectsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SchoolsAndSubjectsQuery, SchoolsAndSubjectsQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<SchoolsAndSubjectsQuery, SchoolsAndSubjectsQueryVariables>(SchoolsAndSubjectsDocument, baseOptions);
      }
      
export type SchoolsAndSubjectsQueryHookResult = ReturnType<typeof useSchoolsAndSubjectsQuery>;
export type SchoolsAndSubjectsQueryResult = ApolloReactCommon.QueryResult<SchoolsAndSubjectsQuery, SchoolsAndSubjectsQueryVariables>;