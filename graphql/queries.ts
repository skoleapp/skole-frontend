const LOGIN = `
    mutation Login($usernameOrEmail: String!, $password: String!) {
        login(username_or_email: $usernameOrEmail, password: $password) {
            token
        }
    }
`;

const REGISTER = `
    mutation Register($username: String!, $email: email, $password: String!) {
        register(usernane: $username, email: $email, password: $password) {
            token
        }
    }
`;

const GET_USER_ME = `
    query GetUserMe($token: String!) {
        getUserMe(token: $token) {
            id
            username
            email
            title
            bio
            points
            language
        }
    }
`;
