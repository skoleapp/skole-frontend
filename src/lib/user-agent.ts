import { GetServerSideProps } from 'next';
import * as R from 'ramda';

// Here we pre-populate the context value with the user's device to conditionally pre-render content.
// Wrap all pages that support `getServerSideProps` with this.
export const withUserAgent = (getInnerProps: GetServerSideProps): GetServerSideProps => {
    const getServerSideProps: GetServerSideProps = async ctx => {
        const result = await getInnerProps(ctx);
        const userAgent = R.path(['req', 'headers', 'user-agent'], ctx) as string;

        const isMobileGuess = !!userAgent
            ? !!userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
            : null;

        return {
            ...result,
            props: {
                ...result.props,
                isMobileGuess,
            },
        };
    };

    return getServerSideProps;
};
