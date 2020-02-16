import { Box, IconButton } from '@material-ui/core';
import {
    AttachmentOutlined,
    CodeOutlined,
    FormatBoldOutlined,
    FormatItalicOutlined,
    FormatListBulletedOutlined,
    FormatListNumberedOutlined,
    FormatQuoteOutlined,
    FormatStrikethroughOutlined,
    LinkOutlined,
    WebAssetOutlined,
} from '@material-ui/icons';
import { DraftHandleValue, Editor, EditorState, RichUtils } from 'draft-js';
import { FormikProps } from 'formik';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '../../i18n';

const inlineStyles = [
    {
        style: 'BOLD',
        icon: FormatBoldOutlined,
    },
    {
        style: 'ITALIC',
        icon: FormatItalicOutlined,
    },
    {
        style: 'STRIKETHROUGH',
        icon: FormatStrikethroughOutlined,
    },
    {
        style: 'CODE',
        icon: CodeOutlined,
    },
];

const blockTypes = [
    {
        blockType: 'link',
        icon: LinkOutlined,
    },
    {
        blockType: 'unordered-list-item',
        icon: FormatListNumberedOutlined,
    },
    {
        blockType: 'ordered-list-item',
        icon: FormatListBulletedOutlined,
    },
    {
        blockType: 'blockquote',
        icon: FormatQuoteOutlined,
    },
    {
        blockType: 'code-block',
        icon: WebAssetOutlined,
    },
];

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

    const toggleBlockType = (blockType: string) => (): void => {
        setEditorState(RichUtils.toggleBlockType(editorState, blockType));
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
                {inlineStyles.map(({ style, icon: Icon }, i) => (
                    <IconButton key={i} onClick={toggleInlineStyle(style)}>
                        <Icon />
                    </IconButton>
                ))}
                {blockTypes.map(({ blockType, icon: Icon }, i) => (
                    <IconButton key={i} onClick={toggleBlockType(blockType)}>
                        <Icon />
                    </IconButton>
                ))}
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
