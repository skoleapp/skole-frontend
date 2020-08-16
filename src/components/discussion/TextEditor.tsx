import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    Grid,
    IconButton,
    Size,
    TextField,
    Tooltip,
} from '@material-ui/core';
import {
    AlternateEmailOutlined,
    AttachFileOutlined,
    CameraAltOutlined,
    ClearOutlined,
    CodeOutlined,
    FormatBoldOutlined,
    FormatItalicOutlined,
    FormatListBulletedOutlined,
    FormatListNumberedOutlined,
    FormatQuoteOutlined,
    LinkOutlined,
    SendOutlined,
    SentimentSatisfiedOutlined,
    StrikethroughSRounded,
} from '@material-ui/icons';
import { useAuthContext, useDeviceContext, useDiscussionContext } from 'context';
import {
    CompositeDecorator,
    ContentBlock,
    DraftHandleValue,
    Editor,
    EditorState,
    getDefaultKeyBinding,
    KeyBindingUtil,
    RichUtils,
} from 'draft-js';
import { FormikProps } from 'formik';
import { DraftLink, linkStrategy, useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent, KeyboardEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CreateCommentFormValues } from 'types';
import { RICH_STYLES } from 'utils';

const { hasCommandModifier } = KeyBindingUtil;

export const TextEditor: React.FC<FormikProps<CreateCommentFormValues>> = ({ setFieldValue, submitForm }) => {
    const decorator = new CompositeDecorator([
        {
            strategy: linkStrategy,
            component: DraftLink,
        },
    ]);

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty(decorator));
    const ref = useRef<Editor | null>(null);
    const isMobile = useDeviceContext();
    const { t } = useTranslation();
    const { commentAttachment, setCommentAttachment, toggleCommentModal } = useDiscussionContext();
    const { verified, verificationRequiredTooltip } = useAuthContext();
    const placeholder = verificationRequiredTooltip || t('forms:createComment') + '...';
    const contentState = editorState.getCurrentContent();
    const disabled = !verified;
    const selection = editorState.getSelection();
    const selectionCollapsed = selection.isCollapsed();
    const textContent = editorState.getCurrentContent().getPlainText('\u0001');
    const attachmentInputRef = useRef<HTMLInputElement | null>(null);
    const handleUploadAttachment = (): false | void =>
        !!attachmentInputRef.current && attachmentInputRef.current.click();

    const [focused, setFocused] = useState(false);
    const onFocus = (): void => setFocused(true);
    const onBlur = (): void => setFocused(false);
    const focusEditor = (): false | void => !!ref && !!ref.current && ref.current.focus();
    const [URLInputOpen, setURLInputOpen] = useState(false);
    const [URL, setURL] = useState('');

    const blurEditor = (): false | void => {
        !!ref && !!ref.current && ref.current.blur();
        onBlur();
    };

    const handleCloseURLInput = (): void => {
        setURLInputOpen(false);
        focusEditor();
    };

    const handleLinkInputChange = (e: ChangeEvent<HTMLInputElement>): void => setURL(e.target.value);

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

    const { bold, italic, strikeThrough, link, orderedList, unorderedList, blockQuote, codeBlock } = RICH_STYLES;

    const inlineStyles = [
        {
            tooltip: t('tooltips:bold', { hotkeyBold }),
            icon: FormatBoldOutlined,
            style: bold,
        },
        {
            tooltip: t('tooltips:italic', { hotkeyItalic }),
            icon: FormatItalicOutlined,
            style: italic,
        },
        {
            tooltip: t('tooltips:strikeThrough', { hotkeyStrikethrough }),
            icon: StrikethroughSRounded,
            style: strikeThrough,
        },
    ];

    const blockTypes = [
        {
            tooltip: t('tooltips:orderedList', { hotkeyOrderedList }),
            icon: FormatListNumberedOutlined,
            style: orderedList,
        },
        {
            tooltip: t('tooltips:bulletedList', { hotkeyBulletedList }),
            icon: FormatListBulletedOutlined,
            style: unorderedList,
        },
        {
            tooltip: t('tooltips:blockQuote', { hotkeyBlockQuote }),
            icon: FormatQuoteOutlined,
            style: blockQuote,
        },
        {
            tooltip: t('tooltips:codeBlock', { hotkeyCodeBlock }),
            icon: CodeOutlined,
            style: codeBlock,
        },
    ];

    const commonToolbarButtonProps = {
        size: 'small' as Size,
        disabled: disabled,
    };

    useEffect(() => {
        setIsMac(navigator.userAgent.indexOf('Mac OS X') !== -1);
    }, []);

    const handleLinkPrompt = (): void => {
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

    const toggleInlineStyle = (style: string) => (e: SyntheticEvent): void => {
        e.preventDefault();
        setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    };

    const toggleBlockStyle = (blockType: string) => (e: SyntheticEvent): void => {
        e.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    };

    const handleKeyCommand = (command: string, editorState: EditorState): DraftHandleValue => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            setEditorState(newState);
            return 'handled';
        }

        if (command === RICH_STYLES.strikeThrough) {
            setEditorState(RichUtils.toggleInlineStyle(editorState, command));
            return 'handled';
        }

        if (command === RICH_STYLES.link) {
            handleLinkPrompt();
            return 'handled';
        }

        if ([orderedList, unorderedList, blockQuote, codeBlock].includes(command)) {
            setEditorState(RichUtils.toggleBlockType(editorState, command));
            return 'handled';
        }

        return 'not-handled';
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

    const handleSubmit = (): void => {
        submitForm();
        setEditorState(EditorState.createEmpty()); // Reset editor.
        setTimeout(() => blurEditor(), 0);
    };

    const getKeyBinding = (e: KeyboardEvent<{}>): string | null => {
        switch (e.keyCode) {
            // CMD + Shift + X
            case 88: {
                return hasCommandModifier(e) && !!e.shiftKey ? strikeThrough : null;
            }

            // CMD + Shift + U
            case 85: {
                return hasCommandModifier(e) && !!e.shiftKey ? link : null;
            }

            // CMD + Shift + 7
            case 55: {
                return hasCommandModifier(e) && !!e.shiftKey ? orderedList : null;
            }

            // CMD + Shift + 8
            case 56: {
                return hasCommandModifier(e) && !!e.shiftKey ? unorderedList : null;
            }

            // CMD + Shift + 9
            case 57: {
                return hasCommandModifier(e) && !!e.shiftKey ? blockQuote : null;
            }

            // CMD + Shift + C
            case 67: {
                return hasCommandModifier(e) && !!e.shiftKey ? codeBlock : null;
            }

            default: {
                return getDefaultKeyBinding(e);
            }
        }
    };

    const handleReturn = (e: KeyboardEvent<{}>, editorState: EditorState): DraftHandleValue => {
        if (e.shiftKey) {
            setEditorState(RichUtils.insertSoftNewline(editorState));
            return 'handled';
        } else {
            handleSubmit();
            return 'handled';
        }
    };

    const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const reader = new FileReader();
        const attachment = R.path(['currentTarget', 'files', '0'], e) as File;
        reader.readAsDataURL(attachment);

        reader.onloadend = (): void => {
            setFieldValue('attachment', attachment);
            setCommentAttachment(reader.result);
            toggleCommentModal(true);
        };
    };

    const handleClearAttachment = (): void => {
        setFieldValue('attachment', null);
        setCommentAttachment(null);
    };

    const renderTextField = (
        <Editor
            ref={ref}
            editorState={editorState}
            onChange={handleChange}
            handleKeyCommand={handleKeyCommand}
            blockStyleFn={getBlockStyle}
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
            keyBindingFn={getKeyBinding}
            handleReturn={handleReturn}
            readOnly={disabled}
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
                    label={t('forms:url')}
                    placeholder={t('forms:urlPlaceholder')}
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

    const renderSendButton = (
        <Box marginLeft="auto">
            <Tooltip title={t('tooltips:sendMessage')}>
                <span>
                    <IconButton
                        {...commonToolbarButtonProps}
                        onClick={handleSubmit}
                        color={!disabled && (!!textContent || !!commentAttachment) ? 'primary' : 'default'}
                        disabled={disabled || (!textContent && !commentAttachment)} // Require either text content or an attachment.
                    >
                        <SendOutlined />
                    </IconButton>
                </span>
            </Tooltip>
        </Box>
    );

    const renderBottomToolbar = (
        <Box marginTop="0.25rem" display="flex">
            {renderInlineStyles}
            {renderLinkButton}
            {renderBlockStyles}
            {renderSendButton}
        </Box>
    );

    const renderMentionButton = (
        <Tooltip title={t('tooltips:mention')}>
            <span>
                <IconButton {...commonToolbarButtonProps} disabled>
                    <AlternateEmailOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderEmojiButton = (
        <Tooltip title={t('tooltips:emoji')}>
            <span>
                <IconButton {...commonToolbarButtonProps} disabled>
                    <SentimentSatisfiedOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderAttachmentButton = (
        <>
            <input
                ref={attachmentInputRef}
                value=""
                accept=".png, .jpg, .jpeg"
                type="file"
                capture={isMobile && 'camera'}
                onChange={handleAttachmentChange}
                disabled={disabled}
            />
            <Tooltip title={t('tooltips:attachFile')}>
                <span>
                    <IconButton onClick={handleUploadAttachment} {...commonToolbarButtonProps}>
                        {isMobile ? <CameraAltOutlined /> : <AttachFileOutlined />}
                    </IconButton>
                </span>
            </Tooltip>
        </>
    );

    const renderClearAttachmentButton = !!commentAttachment && (
        <Tooltip title={t('tooltips:clearAttachment')}>
            <span>
                <IconButton onClick={handleClearAttachment} {...commonToolbarButtonProps}>
                    <ClearOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderSendHelpText = (
        <FormHelperText>
            <b>Return</b> {t('forms:sendHelpText')}
        </FormHelperText>
    );

    const renderNewLineHelpText = (
        <FormHelperText id="new-line-help-text">
            <b>Shift + Return</b> {t('forms:newLineHelpText')}
        </FormHelperText>
    );

    const renderTopToolbar = (
        <Box marginBottom="0.5rem">
            <Grid container>
                <Grid item xs={12} md={3} container justify="flex-start">
                    {renderMentionButton}
                    {renderEmojiButton}
                    {renderAttachmentButton}
                    {renderClearAttachmentButton}
                </Grid>
                {!isMobile && (
                    <Grid item md={9} container justify="flex-end">
                        {renderSendHelpText}
                        {renderNewLineHelpText}
                    </Grid>
                )}
            </Grid>
        </Box>
    );

    return (
        <StyledTextEditor hidePlaceholder={hidePlaceholder}>
            {renderTopToolbar}
            {renderTextField}
            {renderBottomToolbar}
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
            padding: 0.5rem;
            margin: 0;
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

    #new-line-help-text {
        margin-left: 1rem;
    }

    .MuiSvgIcon-root {
        width: 1.35rem;
        height: 1.35rem;
    }
`;
