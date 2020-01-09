import { breakpoints } from './breakpoints';
import { colors } from './colors';
import { css } from 'styled-components';

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

        .sm-down {
            @media only screen and (min-width: ${breakpoints.SM}) {
                display: none;
            }
        }

        .sm-up {
            @media only screen and (max-width: ${breakpoints.SM}) {
                display: none;
            }
        }

        .md-down {
            @media only screen and (min-width: ${breakpoints.MD}) {
                display: none;
            }
        }

        .md-up {
            @media only screen and (max-width: ${breakpoints.MD}) {
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
