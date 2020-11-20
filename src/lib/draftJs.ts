import { ContentBlock, ContentState } from 'draft-js';

type Callback = (start: number, end: number) => void;

export const linkStrategy = (
  contentBlock: ContentBlock,
  callback: Callback,
  contentState: ContentState,
): void => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, callback);
};
