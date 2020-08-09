import { Box, IconButton, Tooltip } from '@material-ui/core';
import {
    AssignmentOutlined,
    // CodeOutlined,
    FormatBoldOutlined,
    FormatItalicOutlined,
    FormatListBulletedOutlined,
    FormatListNumberedOutlined,
    FormatQuoteOutlined,
    // LinkOutlined,
    // StrikethroughSRounded,
} from '@material-ui/icons';
import { DraftEditorCommand, DraftHandleValue, Editor, EditorState, RichUtils } from 'draft-js';
import { useTranslation } from 'lib';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

// TODO: Finish this and use this instead of the current text field as the form input field.
export const TextEditor: React.FC = () => {
    const { t } = useTranslation();
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const editor = useRef<Editor>(null);
    const handleChange = (editorState: EditorState): void => setEditorState(editorState);
    const focusEditor = (): false | void => !!editor.current && editor.current.focus();
    const disabled = false;
    const [isMac, setIsMac] = useState<boolean | null>(null);
    const actionKey = isMac ? '⌘' : 'Ctrl';
    const hotkeyBold = `${actionKey} + B`;
    const hotkeyItalic = `${actionKey} + I`;
    // const hotkeyStrikethrough = `${actionKey} + Shift + X`;
    // const hotkeyCode = `${actionKey} + Shift + C`;
    // const hotkeyLink = `${actionKey} + Shift + U`;
    const hotkeyOrderedList = `${actionKey} + Shift + 7`;
    const hotkeyBulletedList = `${actionKey} + Shift + 8`;
    const hotkeyBlockQuote = `${actionKey} + Shift + 9`;
    const hotkeyCodeBlock = `${actionKey} + Option + Shift + C`;

    const inlineStyles = [
        {
            tooltip: t('tooltips:bold', { hotkeyBold }),
            icon: FormatBoldOutlined,
            style: 'BOLD',
        },
        {
            tooltip: t('tooltips:italic', { hotkeyItalic }),
            icon: FormatItalicOutlined,
            style: 'ITALIC',
        },
        // {
        //     tooltip: t('tooltips:strikeThrough', { hotkeyStrikethrough }),
        //     icon: StrikethroughSRounded,
        //     style: '',
        // },
        // {
        //     tooltip: t('tooltips:code', { hotkeyCode }),
        //     icon: CodeOutlined,
        //     style: '',
        // },
        // {
        //     tooltip: t('tooltips:link', { hotkeyLink }),
        //     icon: LinkOutlined,
        //     style: '',
        // },
        {
            tooltip: t('tooltips:orderedList', { hotkeyOrderedList }),
            icon: FormatListNumberedOutlined,
            style: 'ordered-list-item',
        },
        {
            tooltip: t('tooltips:bulletedList', { hotkeyBulletedList }),
            icon: FormatListBulletedOutlined,
            style: 'unordered-list-item',
        },
        {
            tooltip: t('tooltips:blockQuote', { hotkeyBlockQuote }),
            icon: FormatQuoteOutlined,
            style: 'blockquote',
        },
        {
            tooltip: t('tooltips:codeBlock', { hotkeyCodeBlock }),
            icon: AssignmentOutlined,
            style: 'CODE',
        },
    ];

    useEffect(() => {
        focusEditor();
        setIsMac(navigator.userAgent.indexOf('Mac OS X') !== -1);
    }, []);

    const handleKeyCommand = (command: DraftEditorCommand, editorState: EditorState): DraftHandleValue => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            setEditorState(newState);
            return 'handled';
        }

        return 'not-handled';
    };

    const toggleInlineStyle = (style: string) => (): void =>
        handleChange(RichUtils.toggleInlineStyle(editorState, style));

    const renderTextField = (
        <Editor ref={editor} editorState={editorState} onChange={handleChange} handleKeyCommand={handleKeyCommand} />
    );

    const renderToolbar = (
        <Box marginTop="0.25rem" display="flex">
            {inlineStyles.map(({ tooltip, icon: Icon, style }, i) => (
                <Tooltip key={i} title={tooltip}>
                    <span>
                        <IconButton
                            onClick={toggleInlineStyle(style)}
                            size="small"
                            disabled={disabled}
                            color={editorState.getCurrentInlineStyle().has(style) ? 'primary' : 'default'}
                        >
                            <Icon />
                        </IconButton>
                    </span>
                </Tooltip>
            ))}
        </Box>
    );

    return (
        <StyledTextEditor>
            {renderTextField}
            {renderToolbar}
        </StyledTextEditor>
    );
};

const StyledTextEditor = styled(Box)`
    .DraftEditor-editorContainer {
        max-height: 5rem;
        overflow-y: auto;
    }
`;
