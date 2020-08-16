import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Size,
    TextField,
    Tooltip,
} from '@material-ui/core';
import {
    AttachFileOutlined,
    CodeOutlined,
    FormatBoldOutlined,
    FormatItalicOutlined,
    FormatListBulletedOutlined,
    FormatListNumberedOutlined,
    FormatQuoteOutlined,
    LinkOutlined,
    SendOutlined,
    StrikethroughSRounded,
} from '@material-ui/icons';
import { useAuthContext } from 'context';
import {
    CompositeDecorator,
    ContentBlock,
    DraftEditorCommand,
    DraftHandleValue,
    Editor,
    EditorState,
    RichUtils,
} from 'draft-js';
import { FormikProps } from 'formik';
import { DraftLink, linkStrategy, useTranslation } from 'lib';
import React, { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CreateCommentFormValues } from 'types';

interface Props extends FormikProps<CreateCommentFormValues> {
    handleAttachmentChange: (e: ChangeEvent<HTMLInputElement>) => void;
    attachment: string | ArrayBuffer | null;
}

export const TextEditor: React.FC<Props> = ({ setFieldValue, submitForm, handleAttachmentChange, attachment }) => {
    const decorator = new CompositeDecorator([
        {
            strategy: linkStrategy,
            component: DraftLink,
        },
    ]);

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty(decorator));
    const ref = useRef<Editor | null>(null);
    const focusEditor = (): false | void => !!ref && !!ref.current && ref.current.focus();
    const { t } = useTranslation();
    const { verified, verificationRequiredTooltip } = useAuthContext();
    const contentState = editorState.getCurrentContent();
    const disabled = !verified;
    const selection = editorState.getSelection();
    const selectionCollapsed = selection.isCollapsed();
    const textContent = editorState.getCurrentContent().getPlainText('\u0001');
    const attachmentInputRef = useRef<HTMLInputElement | null>(null);
    const handleUploadAttachment = (): false | void =>
        !!attachmentInputRef.current && attachmentInputRef.current.click();

    // const inputTooltip = !!verificationRequiredTooltip ? verificationRequiredTooltip : '';
    const submitButtonTooltip = !!verificationRequiredTooltip ? verificationRequiredTooltip : t('tooltips:sendMessage');
    const attachmentButtonTooltip = !!verificationRequiredTooltip
        ? verificationRequiredTooltip
        : t('tooltips:attachFile');

    const [focused, setFocused] = useState(false);
    const onFocus = (): void => setFocused(true);
    const onBlur = (): void => setFocused(false);

    // If the user changes block type before entering any text, we hide the placeholder.
    // Placeholder is also hidden whenever editor is focused.
    const hidePlaceholder =
        (!contentState.hasText() &&
            contentState
                .getBlockMap()
                .first()
                .getType() !== 'unstyled') ||
        focused;

    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    const handleChange = (editorState: EditorState): void => {
        setEditorState(editorState);
        setFieldValue('text', textContent);
    };

    const [isMac, setIsMac] = useState<boolean | null>(null);
    const actionKey = isMac ? '⌘' : 'Ctrl';
    const hotkeyBold = `${actionKey} + B`;
    const hotkeyItalic = `${actionKey} + I`;
    const hotkeyStrikethrough = `${actionKey} + Shift + X`;
    const hotkeyLink = `${actionKey} + Shift + U`;
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
        {
            tooltip: t('tooltips:strikeThrough', { hotkeyStrikethrough }),
            icon: StrikethroughSRounded,
            style: 'STRIKETHROUGH',
        },
    ];

    const blockTypes = [
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
            icon: CodeOutlined,
            style: 'code-block',
        },
    ];

    const commonToolbarButtonProps = {
        size: 'small' as Size,
        disabled: disabled,
    };

    useEffect(() => {
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

    const toggleInlineStyle = (style: string) => (e: SyntheticEvent): void => {
        e.preventDefault();
        setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    };

    const toggleBlockStyle = (blockType: string) => (e: SyntheticEvent): void => {
        e.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    };

    const getBlockStyle = (block: ContentBlock): string => {
        switch (block.getType()) {
            case 'blockquote': {
                return 'RichEditor-blockquote';
            }

            default: {
                return '';
            }
        }
    };

    const [URLInputOpen, setURLInputOpen] = useState(false);
    const [URL, setURL] = useState('');

    const handleCloseURLInput = (): void => {
        setURLInputOpen(false);
        focusEditor();
    };

    const handleLinkInputChange = (e: ChangeEvent<HTMLInputElement>): void => setURL(e.target.value);

    const handleLinkPrompt = (e: SyntheticEvent): void => {
        e.preventDefault();

        if (!selectionCollapsed) {
            const startKey = selection.getStartKey();
            const startOffset = selection.getStartOffset();
            const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
            const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

            let url = '';

            if (linkKey) {
                const linkInstance = contentState.getEntity(linkKey);
                url = linkInstance.getData().url;
            }

            setURLInputOpen(true);
            setURL(url);
        }
    };

    const confirmLink = (): void => {
        const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url: URL });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
        setEditorState(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey));
        setURLInputOpen(false);
        setURL('');
        setTimeout(() => focusEditor(), 0);
    };

    const renderTextField = (
        <Editor
            ref={ref}
            editorState={editorState}
            onChange={handleChange}
            handleKeyCommand={handleKeyCommand}
            blockStyleFn={getBlockStyle}
            placeholder={t('common:createComment') + '...'}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    );

    const renderInlineStyles = inlineStyles.map(({ tooltip, icon: Icon, style }, i) => (
        <Tooltip key={i} title={tooltip}>
            <span>
                <IconButton
                    {...commonToolbarButtonProps}
                    onMouseDown={toggleInlineStyle(style)}
                    color={editorState.getCurrentInlineStyle().has(style) ? 'primary' : 'default'}
                >
                    <Icon />
                </IconButton>
            </span>
        </Tooltip>
    ));

    const renderLinkButton = (
        <Tooltip title={t('tooltips:link', { hotkeyLink })}>
            <span>
                <IconButton
                    {...commonToolbarButtonProps}
                    disabled={disabled || selectionCollapsed}
                    onMouseDown={handleLinkPrompt}
                >
                    <LinkOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderURLInput = (
        <Dialog open={URLInputOpen} onClose={handleCloseURLInput}>
            <DialogTitle>{t('forms:addLink')}</DialogTitle>
            <DialogContent>
                <TextField
                    value={URL}
                    onChange={handleLinkInputChange}
                    label={t('forms:link')}
                    variant="outlined"
                    autoFocus
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseURLInput}>{t('common:cancel')}</Button>
                <Button onClick={confirmLink} color="primary">
                    {t('common:confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );

    const renderBlockStyles = blockTypes.map(({ tooltip, icon: Icon, style }, i) => (
        <Tooltip key={i} title={tooltip}>
            <span>
                <IconButton
                    {...commonToolbarButtonProps}
                    onMouseDown={toggleBlockStyle(style)}
                    color={style === blockType ? 'primary' : 'default'}
                >
                    <Icon />
                </IconButton>
            </span>
        </Tooltip>
    ));

    const renderAttachmentButton = (
        <>
            <input
                ref={attachmentInputRef}
                value=""
                accept=".png, .jpg, .jpeg"
                type="file"
                onChange={handleAttachmentChange}
                disabled={disabled}
            />
            <Tooltip title={attachmentButtonTooltip}>
                <span>
                    <IconButton onClick={handleUploadAttachment} {...commonToolbarButtonProps}>
                        <AttachFileOutlined />
                    </IconButton>
                </span>
            </Tooltip>
        </>
    );

    const renderSendButton = (
        <Box marginLeft="auto">
            <Tooltip title={submitButtonTooltip}>
                <span>
                    <IconButton
                        {...commonToolbarButtonProps}
                        onClick={submitForm}
                        color={!disabled && (!!textContent || !!attachment) ? 'primary' : 'default'}
                        disabled={disabled || (!textContent && !attachment)} // Require either text content or an attachment.
                    >
                        <SendOutlined />
                    </IconButton>
                </span>
            </Tooltip>
        </Box>
    );

    const renderToolbar = (
        <Box marginTop="0.25rem" display="flex">
            {renderInlineStyles}
            {renderLinkButton}
            {renderBlockStyles}
            {renderAttachmentButton}
            {renderSendButton}
        </Box>
    );

    return (
        <StyledTextEditor hidePlaceholder={hidePlaceholder}>
            {renderTextField}
            {renderToolbar}
            {renderURLInput}
        </StyledTextEditor>
    );
};

// Ignore: hidePlaceholder must be omitted from Box props.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledTextEditor = styled(({ hidePlaceholder, ...props }) => <Box {...props} />)`
    width: 100%;
    word-break: break-all;

    .DraftEditor-editorContainer {
        max-height: 5rem;
        overflow-y: auto;
        padding: 0.25rem;

        .RichEditor-blockquote {
            border-left: 0.5rem solid #eee;
            color: #666;
            padding: 0.25rem;
        }

        .public-DraftStyleDefault-pre {
            background-color: rgba(0, 0, 0, 0.05);
            padding: 0.5rem;
            margin: 0;
        }
    }

    .public-DraftEditorPlaceholder-root {
        display: ${({ hidePlaceholder }): false | string => hidePlaceholder && 'none'};
    }
`;
