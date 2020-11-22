import { ContentState } from 'draft-js';
import React from 'react';
import { TextLink } from '../shared';

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
