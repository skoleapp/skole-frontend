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
        --light-opacity: rgba(0, 0, 0, 0.25);
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

        form {
            .MuiFormControl-root {
                margin-top: 0.75rem;
            }

            input[type='submit'] {
                display: none;
            }
        }

        .MuiLink-root {
            cursor: pointer;
        }

        .MuiTypography-h1 {
            font-size: 2rem;
        }

        .MuiTypography-h2 {
            font-size: 1.5rem;
        }

        .MuiTypography-h3 {
            font-size: 1.25rem;
        }

        // .MuiGrid-root {
        //     flex-grow: 1;
        // }

        .MuiDialog-paper {
            .MuiDialogTitle-root,
            .MuiDialogContent-root {
                text-align: center;
            }

            .MuiDialogActions-root {
                margin: auto;
            }
        }

        .MuiTabs-root {
            width: 100%;

            .MuiTab-root {
                flex-grow: 1;
            }

            .MuiTabs-scrollButtons {
                color: var(--primary);
            }
        }

        .MuiCardHeader-root {
            padding: 0.5rem !important;
        }

        .MuiCardContent-root {
            padding: 0.5rem;
        }

        .border-bottom {
            border-bottom: var(--border);
        }

        .main-avatar {
            height: 8rem;
            width: 8rem;
            margin: 1rem;
        }
    }
`;
