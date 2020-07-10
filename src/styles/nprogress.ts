import { css } from 'styled-components';

import { breakpoints } from '.';

export const nProgress = css`
    #nprogress {
        .bar {
            height: 0.25rem;
            background: var(--white);
            top: 2.75rem;
            z-index: 1101;

            @media only screen and (min-width: ${breakpoints.MD}) {
                top: 3.75rem;
            }
        }

        .peg {
            box-shadow: none;
            transform: none;
        }

        .spinner-icon {
            display: none;
        }
    }
`;
