import { TextLink } from 'components';
import { ContentBlock, ContentState } from 'draft-js';
import React from 'react';

type Callback = (start: number, end: number) => void;

export const linkStrategy = (contentBlock: ContentBlock, callback: Callback, contentState: ContentState): void => {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
    }, callback);
};

interface Props {
    contentState: ContentState;
    entityKey: string;
}

export const DraftLink: React.FC<Props> = ({ children, contentState, entityKey }) => {
    const { url } = contentState.getEntity(entityKey).getData();

    return (
        <TextLink href={url} color="primary" rel="noopener noreferrer" target="_blank">
            {children}
        </TextLink>
    );
};
