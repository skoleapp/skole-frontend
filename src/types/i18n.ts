import { GetStaticPropsContext, GetStaticPropsResult } from 'next';

interface GetStaticI18nPropsContext extends GetStaticPropsContext {
    lang: string;
}

// A wrapper for `GetStaticProps` to inject the `lang`-attribute in the context.
export type GetStaticI18nProps = (context: GetStaticI18nPropsContext) => Promise<GetStaticPropsResult<{}>>;
