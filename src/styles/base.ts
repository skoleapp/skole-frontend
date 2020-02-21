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

        --hover-opacity: rgba(0, 0, 0, 0.05);
        --border-color: rgba(0, 0, 0, 0.12);
        --dark-opacity: rgba(0, 0, 0, 0.75);

        // Misc
        --transition: all 0.15s ease-in;
        --border-radius: 0.25rem;
        --border: 1px solid var(--border-color); // Default MUI border.
    }

    html,
    body {
        background: var(--secondary);

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

        .main-avatar {
            height: 10rem;
            width: 10rem;
            margin: 1rem;
        }

        form {
            .MuiFormControl-root {
                margin-top: 0.75rem;
            }

            input[type='submit'] {
                display: none;
            }
        }
    }
`;
