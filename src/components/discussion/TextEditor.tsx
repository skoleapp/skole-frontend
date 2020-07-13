import { Box, IconButton, Tooltip } from '@material-ui/core';
import {
    AssignmentOutlined,
    CodeOutlined,
    FormatBoldOutlined,
    FormatItalicOutlined,
    FormatListBulletedOutlined,
    FormatListNumberedOutlined,
    FormatQuoteOutlined,
    LinkOutlined,
    StrikethroughSRounded,
} from '@material-ui/icons';
import { DraftEditorCommand, DraftHandleValue, Editor, EditorState, RichUtils } from 'draft-js';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export const TextEditor: React.FC = () => {
    const { t } = useTranslation();
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const editor = useRef<Editor>(null);
    const handleChange = (editorState: EditorState): void => setEditorState(editorState);
    const focusEditor = (): false | void => !!editor.current && editor.current.focus();
    const disabled = false;

    useEffect(() => {
        focusEditor();
    }, []);

    const handleKeyCommand = (command: DraftEditorCommand, editorState: EditorState): DraftHandleValue => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            setEditorState(newState);
            return 'handled';
        }

        return 'not-handled';
    };

    const renderTextField = (
        <Editor ref={editor} editorState={editorState} onChange={handleChange} handleKeyCommand={handleKeyCommand} />
    );

    const renderToolbar = (
        <Box marginTop="0.25rem" display="flex">
            <Tooltip title={t('tooltips:bold')}>
                <span>
                    <IconButton size="small" disabled={disabled}>
                        <FormatBoldOutlined />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title={t('tooltips:italic')}>
                <span>
                    <IconButton size="small" disabled={disabled}>
                        <FormatItalicOutlined />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title={t('tooltips:strikeThrough')}>
                <span>
                    <IconButton size="small" disabled={disabled}>
                        <StrikethroughSRounded />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title={t('tooltips:code')}>
                <span>
                    <IconButton size="small" disabled={disabled}>
                        <CodeOutlined />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title={t('tooltips:link')}>
                <span>
                    <IconButton size="small" disabled={disabled}>
                        <LinkOutlined />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title={t('tooltips:orderedList')}>
                <span>
                    <IconButton size="small" disabled={disabled}>
                        <FormatListNumberedOutlined />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title={t('tooltips:bulletedList')}>
                <span>
                    <IconButton size="small" disabled={disabled}>
                        <FormatListBulletedOutlined />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title={t('tooltips:blockQuote')}>
                <span>
                    <IconButton size="small" disabled={disabled}>
                        <FormatQuoteOutlined />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title={t('tooltips:codeBlock')}>
                <span>
                    <IconButton size="small" disabled={disabled}>
                        <AssignmentOutlined />
                    </IconButton>
                </span>
            </Tooltip>
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
