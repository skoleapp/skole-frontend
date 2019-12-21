import { NextComponentType } from 'next';
import { SkoleContext } from './context';

export type I18nPage<P = {}> = NextComponentType<
  SkoleContext,
  { namespacesRequired: string[] },
  P & { namespacesRequired: string[] }
>;

export interface I18nProps {
  namespacesRequired: string[];
}
