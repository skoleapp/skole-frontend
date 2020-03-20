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

        .MuiGrid-root {
            flex-grow: 1;
        }

        .MuiDialog-paper {
            .MuiDialogTitle-root,
            .MuiDialogContent-root {
                text-align: center;
            }

            .MuiDialogActions-root {
                margin: auto;
            }
        }

        .MuiListItem-root {
            cursor: pointer;

            &:hover {
                background-color: var(--hover-opacity);
            }

            .MuiListItemText-primary {
                display: flex;
                align-items: center;

                .MuiSvgIcon-root {
                    margin-right: 0.5rem;
                }
            }
        }

        .MuiList-root {
            outline: none;

            .MuiListSubheader-root {
                text-align: left;
                outline: none;
            }

            .MuiListItem-root {
                padding: 0.5rem;
            }

            .MuiAvatar-root {
                background-color: var(--primary);
                width: 2rem;
                height: 2rem;

                .MuiSvgIcon-root {
                    width: 1rem;
                    height: 1rem;
                }
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

        .MuiBottomNavigation-root {
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 3rem !important;
            border-top: var(--border);
            z-index: 1000;

            .MuiButtonBase-root,
            .Mui-selected {
                padding: 0 !important;
            }

            @media only screen and (min-width: ${breakpoints.MD}) {
                display: none !important;
            }
        }

        input#attachment {
            display: none;
        }

        .modal-input-area {
            display: flex;
            align-items: center;
            margin: 0.5rem;
            margin-top: auto;

            @media only screen and (min-width: ${breakpoints.MD}) {
                margin: 0.5rem 0 0 0 !important;
            }
        }

        #comment-attachment-container {
            margin: 0.5rem;

            @media only screen and (min-width: ${breakpoints.MD}) {
                margin: 0;
            }
        }
    }
`;
