import { OperationVariables } from '@apollo/client';
import { useRouter } from 'next/router';

// Custom hook for getting base query options for translated GQL client-side queries.
// These options work out-of-the-box for all detail queries, feel free to override these as you want.
export const useQueryOptions = (): OperationVariables => {
    const { query, locale } = useRouter();

    return {
        variables: query,
        fetchPolicy: 'no-cache', // Disable caching so we can always fetch correct translations and up-to-date content from the API.
        context: {
            headers: {
                'Accept-Language': locale,
            },
        },
    };
};
