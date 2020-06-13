import { GetServerSideProps } from 'next';
import * as R from 'ramda';

// We sniff the user agent in order to pre-populate the context value about the user's device.
export const withUserAgent = (getServerSidePropsInner: GetServerSideProps): GetServerSideProps => {
    const getServerSideProps: GetServerSideProps = async ctx => {
        const result = await getServerSidePropsInner(ctx);
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
