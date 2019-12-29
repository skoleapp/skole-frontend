import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { NextComponentType, NextPageContext } from 'next';
import { Store } from 'redux';

export interface Auth {
    user: User | null;
    authenticated: boolean | null;
}

export interface City {
    id: string;
    name: string;
}

export interface ContactFormValues {
    contactType: string;
    email: string;
    message: string;
}

export interface SkoleContext extends NextPageContext {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    reduxStore: Store;
    userMe: User;
}

export interface Country {
    id: string;
    name: string;
}

export interface Course {
    id: number;
    name: string;
    code: string;
    subject: Subject;
    school: School;
    creator: User;
    created: string;
    modified: string;
    resources: Resource[];
    points: number;
}

export type FeedbackType = 'bad' | 'neutral' | 'good' | '';

export interface PasswordForm {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface UpdateProfileFormValues {
    username: string;
    email: string;
    title: string;
    bio: string;
    avatar: string;
}

export interface SignUpFormValues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SignInFormValues {
    usernameOrEmail: string;
    password: string;
}

export interface CreateCourseFormValues {
    courseName: string;
    courseCode: string;
    subject: string;
    school: string;
    general: string;
}

export interface FilterSearchResultsFormValues {
    courseName: string;
    courseCode: string;
    schoolName: string;
    subjectName: string;
    schoolType: string;
    countryName: string;
    cityName: string;
}

export interface UploadResourceFormValues {
    resourceTitle: string;
    resourceType: string;
    course: string;
    files: File[];
}

export interface DeleteAccountFormValues {
    password: string;
}

export interface ForgotPasswordFormValues {
    email: string;
}

export interface ResetPasswordFormValues {
    password: string;
    confirmPassword: string;
}

export type I18nPage<P = {}> = NextComponentType<
    SkoleContext,
    { namespacesRequired: string[] },
    P & { namespacesRequired: string[] }
>;

export interface I18nProps {
    namespacesRequired: string[];
}

export interface Notification {
    open: boolean;
    message: string | null;
}

export interface ResourceType {
    id: string;
    name: string;
}

export interface ResourcePart {
    id: string;
    title: string;
    file: string;
    text: string;
}

export interface Resource {
    id: string;
    resourceType: string;
    resourceParts: ResourcePart[];
    title: string;
    file: string;
    date: string;
    course: Course;
    creator: User;
    points: number;
    modified: string;
    created: string;
}

export interface SchoolType {
    id: string;
    name: string;
}

export interface School {
    id: string;
    schoolType: string;
    name: string;
    city: string;
    country: string;
    courseCount: number;
    subjectCount: number;
}

export interface State {
    auth: Auth;
    notification: Notification;
}

export interface Subject {
    id: string;
    name: string;
}

export interface User {
    id: string;
    username: string;
    email: string | null;
    title: string | null;
    bio: string | null;
    avatar: string;
    avatarThumbnail: string;
    points: number;
    courseCount: number;
    resourceCount: number;
    created: Date;
    courses?: Course[];
    resources?: Resource[];
}
