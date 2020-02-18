import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';

import { CommentObjectType } from '../../../generated/graphql';
import { CommentTarget } from '../../types';
import { CommentCard } from './CommentCard';
import { CreateCommentForm } from './CreateCommentForm';

interface Props {
    comments: CommentObjectType[];
    isThread?: boolean;
    target: CommentTarget;
}

export const DiscussionBox: React.FC<Props> = ({ comments: initialComments, isThread, target }) => {
    const [comments, setComments] = useState(initialComments);
    const appendComments = (comment: CommentObjectType): void => setComments([...comments, comment]);

    const renderMessageArea = (
        <Box className="message-area">
            {comments.map((c: CommentObjectType, i: number) => (
                <Box key={i}>
                    <CommentCard comment={c} isThread={!!isThread} />
                </Box>
            ))}
        </Box>
    );

    const renderInputArea = (
        <Box className="input-area md-up">
            <CreateCommentForm target={target} appendComments={appendComments} />
        </Box>
    );

    return (
        <StyledDiscussionBox>
            <Box className="discussion-container">
                {renderMessageArea}
                {renderInputArea}
            </Box>
        </StyledDiscussionBox>
    );
};

const StyledDiscussionBox = styled(Box)`
    position: relative;
    flex-grow: 1;

    .discussion-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;

        .message-area {
            flex-grow: 1;
            overflow-y: scroll;

            ::-webkit-scrollbar {
                display: none;
            }
        }

        .input-area {
            padding: 0.5rem;
            border-top: var(--border);
        }
    }
`;
