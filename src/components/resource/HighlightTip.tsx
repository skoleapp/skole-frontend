import { Box } from '@material-ui/core';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import React from 'react';

interface Props {
    onConfirm: (comment: { text: string; emoji: string }) => void;
    onOpen: () => void;
    onUpdate?: () => void;
}

export const HighlightTip: React.FC<Props> = ({ onConfirm, onOpen, onUpdate }) => {
    const [state, setState] = useState({
        compact: true,
        text: '',
        emoji: '',
    });

    const { compact, text, emoji } = state;

    useEffect(() => {
        !!onUpdate && onUpdate();
    }, [compact]);

    const handleClick = (): void => {
        onOpen();
        setState({ ...state, compact: false });
    };

    const handleSubmit = (e: SyntheticEvent): void => {
        e.preventDefault();
        onConfirm({ text, emoji });
    };

    const handleChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>): void =>
        setState({ ...state, text: e.target.value });

    const handleChangeEmoji = (e: ChangeEvent<HTMLInputElement>): void => setState({ ...state, emoji: e.target.value });

    return (
        <Box>
            {compact ? (
                <Box onClick={handleClick}>Add highlight</Box>
            ) : (
                <form onSubmit={handleSubmit}>
                    <Box>
                        <textarea placeholder="Your comment" autoFocus value={text} onChange={handleChangeTextArea} />
                        <Box>
                            {['💩', '😱', '😍', '🔥', '😳', '⚠️'].map(_emoji => (
                                <label key={_emoji}>
                                    <input
                                        checked={emoji === _emoji}
                                        type="radio"
                                        name="emoji"
                                        value={_emoji}
                                        onChange={handleChangeEmoji}
                                    />
                                    {_emoji}
                                </label>
                            ))}
                        </Box>
                    </Box>
                    <Box>
                        <input type="submit" value="Save" />
                    </Box>
                </form>
            )}
        </Box>
    );
};
