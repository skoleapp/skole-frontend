import { Box, IconButton } from '@material-ui/core';
import {
    AttachmentOutlined,
    CodeOutlined,
    FormatBoldOutlined,
    FormatItalicOutlined,
    FormatListBulletedOutlined,
    FormatListNumberedOutlined,
    FormatQuote,
    FormatStrikethroughOutlined,
    LinkOutlined,
} from '@material-ui/icons';
import { DraftHandleValue, Editor, EditorState, RichUtils } from 'draft-js';
import { FormikProps } from 'formik';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '../../i18n';

interface Props extends FormikProps<{}> {
    onKeyPress: (e: KeyboardEvent) => void;
}

export const TextEditor: React.FC<Props> = () => {
    const { t } = useTranslation();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const handleKeyCommand = (command: string, editorState: EditorState): DraftHandleValue => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            setEditorState(newState);
            return 'handled';
        }

        return 'not-handled';
    };

    const toggleInlineStyle = (style: string) => (): void => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    };

    return (
        <StyledTextEditor>
            <Editor
                editorState={editorState}
                onChange={setEditorState}
                handleKeyCommand={handleKeyCommand}
                placeholder={t('forms:message')}
            />
            <Box display="flex">
                <IconButton>
                    <AttachmentOutlined />
                </IconButton>
                <IconButton onClick={toggleInlineStyle('BOLD')}>
                    <FormatBoldOutlined />
                </IconButton>
                <IconButton onClick={toggleInlineStyle('ITALIC')}>
                    <FormatItalicOutlined />
                </IconButton>
                <IconButton onClick={toggleInlineStyle('STRIKE-THROUGH')}>
                    <FormatStrikethroughOutlined />
                </IconButton>
                <IconButton onClick={toggleInlineStyle('CODE')}>
                    <CodeOutlined />
                </IconButton>
                <IconButton onClick={toggleInlineStyle('LINK')}>
                    <LinkOutlined />
                </IconButton>
                <IconButton onClick={toggleInlineStyle('LIST-NUMBERED')}>
                    <FormatListNumberedOutlined />
                </IconButton>
                <IconButton onClick={toggleInlineStyle('LIST-BULLETED')}>
                    <FormatListBulletedOutlined />
                </IconButton>
                <IconButton onClick={toggleInlineStyle('QUOTE')}>
                    <FormatQuote />
                </IconButton>
            </Box>
        </StyledTextEditor>
    );
};

const StyledTextEditor = styled(Box)`
    .DraftEditor-root {
        text-align: left;

        .public-DraftEditor-content > div {
            max-height: 15rem;
            overflow-y: scroll;

            ::-webkit-scrollbar {
                display: none;
            }
        }
    }
`;
