// Ignore: topComment must be omitted from Box props.

import { Box } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from 'styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledDiscussionBox = styled(({ topComment, ...other }) => <Box {...other} />)`
    position: relative;
    flex-grow: 1;

    .discussion-container {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        .message-area {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            overflow-y: scroll;

            @media only screen and (max-width: ${breakpoints.MD}) {
                padding-bottom: ${({ topComment }): string =>
                    !topComment ? 'calc(var(--safe-area-inset-bottom) + 4.5rem)' : 'initial'};
            }

            .MuiDivider-root#reply {
                flex-grow: 1;
                margin-left: 0.5rem;
            }
        }

        .input-area {
            @media only screen and (min-width: ${breakpoints.MD}) {
                border-top: var(--border);
                padding: ${({ topComment }): string | false => (!!topComment ? '0.5rem 0 0 0' : '0.5rem')};
            }
        }

        #create-comment-button {
            position: absolute;
            bottom: calc(var(--safe-area-inset-bottom) + 0.5rem);
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            opacity: 0.7;
            z-index: 1001;
        }
    }
`;
