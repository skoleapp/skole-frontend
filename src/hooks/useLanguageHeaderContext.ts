import { OperationVariables } from '@apollo/client';
import { useRouter } from 'next/router';

// Custom hook for language header for translated GraphQL queries and mutations.
// Use this for every GraphQL query and mutation.
// TODO: Find out if we can automatically inject this in the apollo client.
// The problem is that the `locale` cannot be accessed in server-side code.
export const useLanguageHeaderContext = (): OperationVariables => {
  const { locale } = useRouter();

  return {
    headers: {
      'Accept-Language': locale,
    },
  };
};
