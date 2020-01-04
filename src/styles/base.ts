import { css } from 'styled-components';
import { breakpoints } from './breakpoints';
import { colors } from './colors';

export const base = css`
    :root {
        /* Colors */
        --primary: ${colors.primary};
        --secondary: ${colors.secondary};

        --white: ${colors.white};
        --black: ${colors.black};
        --grey: ${colors.grey};

        --success: ${colors.success};
        --danger: ${colors.danger};

        --primary-opacity: rgba(0, 0, 0, 0.15);
        --dark-opacity: rgba(0, 0, 0, 0.75);

        // Misc
        --transition: all 0.15s ease-in;
        --border-radius: 0.25rem;
    }

    html,
    body {
        background: var(--secondary);
        font-family: 'Roboto', sans-serif;

        .desktop-only {
            @media only screen and (max-width: ${breakpoints.SM}) {
                display: none;
            }
        }

        .mobile-only {
            @media only screen and (min-width: ${breakpoints.SM}) {
                display: none;
            }
        }

        .flex-flow {
            flex-flow: row wrap;
        }

        .MuiLink-root {
            cursor: pointer;
        }
    }
`;
