import { Box, Divider, Typography } from '@material-ui/core';
import * as R from 'ramda';
import React, { useState } from 'react';
import styled from 'styled-components';

import { CommentObjectType } from '../../../generated/graphql';
import { CommentTarget } from '../../types';
import { CommentCard } from './CommentCard';
import { CreateCommentForm } from './CreateCommentForm';

interface Props {
    commentThread?: CommentObjectType | null;
    comments: CommentObjectType[];
    isThread?: boolean;
    target: CommentTarget;
}

export const DiscussionBox: React.FC<Props> = ({ commentThread, comments: initialComments, isThread, target }) => {
    const [comments, setComments] = useState(initialComments);
    const appendComments = (comment: CommentObjectType): void => setComments([...comments, comment]);

    const renderTopComment = !!commentThread && (
        <>
            <CommentCard comment={commentThread} isThread={!!isThread} />
            <Box padding="0.25rem" display="flex" alignItems="center">
                <Typography variant="subtitle2" color="textSecondary">
                    {R.propOr('-', 'replyCount', commentThread)} replies
                </Typography>
                <Divider />
            </Box>
        </>
    );

    const renderMessageArea = (
        <Box className="message-area">
            {renderTopComment}
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

            .MuiDivider-root {
                flex-grow: 1;
                margin-left: 0.5rem;
            }

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
