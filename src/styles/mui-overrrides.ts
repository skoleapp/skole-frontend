import { css } from 'styled-components';

export const muiOverrides = css`
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
        .MuiDialogTitle-root {
            text-align: center;
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

        .MuiDialogActions-root {
            margin: auto;
        }
    }
`;
