import { css } from 'styled-components';

import { colors } from './theme';

export const base = css`
    :root {
        // MUI Colors.

        --primary: ${colors.primary};
        --primary-light: ${colors.primaryLight};
        --primary-dark: ${colors.primaryDark};
        --secondary: ${colors.secondary};
        --secondary-light: ${colors.secondaryLight};
        --secondary-dark: ${colors.secondaryDark};
        --warning: ${colors.warning};
        --info: ${colors.info};
        --success: ${colors.success};
        --error: ${colors.error};
        --white: ${colors.white};
        --black: ${colors.black};

        // Other Colors.

        --gray: #323639; // Same as MUI 'textSecondary'.
        --gray-light: #525659;
        --gray-dark: #262729;
        --hover-color: rgb(239, 239, 239); // Same as on MUI CardActionArea.
        --border-color: rgba(0, 0, 0, 0.12); // Same as MUI border color.
        --opacity: rgba(0, 0, 0, 0.5);
        --opacity-light: rgba(0, 0, 0, 0.25);
        --opacity-dark: rgba(0, 0, 0, 0.75);

        // Misc.

        --border-radius: 0.25rem;
        --border: 1px solid var(--border-color); // Default MUI border.
        --screenshot-border: 0.05rem dashed var(--black);

        //iOS.

        --safe-area-inset-bottom: env(safe-area-inset-bottom);
    }

    html,
    body {
        // MUI overrides.

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

        .MuiCardHeader-action {
            margin: 0;
        }

        // Custom classes.

        .border-bottom {
            border-bottom: var(--border);
        }

        .border-top {
            border-top: var(--border);
        }

        .main-avatar {
            height: 8rem;
            width: 8rem;
        }

        .avatar-thumbnail {
            height: 1.5rem;
            width: 1.5rem;
        }

        .MuiFormControl-root {
            margin-top: 0.75rem;
        }

        input[type='submit'],
        input[type='file'] {
            display: none;
        }

        .truncate {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .desktop-content {
            flex-grow: 1;
        }

        .custom-header {
            height: 3rem;
            padding: 0.5rem;
            border-bottom: var(--border);
        }
    }
`;
