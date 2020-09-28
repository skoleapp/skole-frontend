import { OperationVariables } from '@apollo/client';
import { useTranslation } from 'lib';
import { useRouter } from 'next/router';

// Custom hook for getting base query options for translated GQL client-side queries.
// These options work out-of-the-box for all detail queries, feel free to override these as you want.
export const useQueryOptions = (): OperationVariables => {
    const { query } = useRouter();
    const { i18n } = useTranslation();

    return {
        variables: query,
        fetchPolicy: 'no-cache', // Disable caching so we can always fetch correct translations and up-to-date content from the API.
        context: {
            headers: {
                'Accept-Language': i18n.language,
            },
        },
    };
};
