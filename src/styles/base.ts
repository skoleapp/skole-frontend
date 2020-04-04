import { css } from 'styled-components';

import { colors } from './colors';

export const base = css`
    :root {
        /* Colors */
        --primary: ${colors.primary};
        --secondary: ${colors.secondary};

        --white: ${colors.white};
        --black: ${colors.black};
        --gray: ${colors.gray};

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

        .border-bottom {
            border-bottom: var(--border);
        }

        .main-avatar {
            height: 8rem;
            width: 8rem;
            margin: 1rem;
        }
        .MuiFormControl-root {
            margin-top: 0.75rem;
        }

        input[type='submit'],
        input[type='file'] {
            display: none;
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

        .MuiDialog-paper {
            width: auto;

            .MuiDialogTitle-root,
            .MuiDialogContent-root {
                text-align: center;
            }

            .MuiDialogActions-root {
                margin: auto;
            }
        }

        .MuiDrawer-paperAnchorLeft {
            width: 20rem;
        }

        .MuiDrawer-paperAnchorBottom {
            min-height: 100%;
        }
    }
`;
