import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    Grid,
    IconButton,
    makeStyles,
    Size,
    TextField,
    Tooltip,
    Typography,
    useTheme,
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
    StrikethroughSRounded,
} from '@material-ui/icons';
import clsx from 'clsx';
import { useAuthContext, useDiscussionContext } from 'context';
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
import { useMediaQueries } from 'hooks';
import { DraftLink, linkStrategy, useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent, KeyboardEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { CreateCommentFormValues } from 'types';
import { RICH_STYLES } from 'utils';

import { SkoleDialog } from '../shared';

const { hasCommandModifier } = KeyBindingUtil;

const useStyles = makeStyles(({ spacing }) => ({
    root: {
        width: '100%',
        marginTop: 'auto',
        wordBreak: 'break-all',
        '& .DraftEditor-editorContainer': {
            overflowY: 'auto',
            padding: spacing(1),
            '& .RichEditor-blockquote': {
                borderLeft: `${spacing(2)} solid #eee`,
                color: '#666',
                padding: spacing(2),
                margin: 0,
            },
            '& .public-DraftStyleDefault-pre': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                padding: spacing(2),
                margin: 0,
            },
        },
        '& .public-DraftEditorPlaceholder-root': {
            marginLeft: spacing(2),
        },
    },
    placeholderHidden: {
        '& .public-DraftEditorPlaceholder-root': {
            display: 'none',
        },
    },
    newLineHelpText: {
        marginLeft: spacing(4),
    },
}));

export const RichTextEditor: React.FC<FormikProps<CreateCommentFormValues>> = ({ setFieldValue, submitForm }) => {
    const { spacing } = useTheme();
    const classes = useStyles();
    const decorator = new CompositeDecorator([
        {
            strategy: linkStrategy,
            component: DraftLink,
        },
    ]);

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty(decorator));
    const ref = useRef<Editor>(null!);
    const { t } = useTranslation();
    const { isDesktop, isMobileOrTablet } = useMediaQueries();
    const { commentAttachment, setCommentAttachment, toggleCommentModal } = useDiscussionContext();
    const { verified, userMe, loginRequiredTooltip } = useAuthContext();
    const placeholder = t('forms:createComment') + '...';
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const selectionCollapsed = selection.isCollapsed();
    const textContent = editorState.getCurrentContent().getPlainText('\u0001');
    const attachmentInputRef = useRef<HTMLInputElement>(null!);
    const attachmentTooltip = loginRequiredTooltip || t('tooltips:attachFile');
    const handleUploadAttachment = (): false | void => attachmentInputRef.current.click();
    const [focused, setFocused] = useState(false);
    const onFocus = (): void => setFocused(true);
    const onBlur = (): void => setFocused(false);
    const focusEditor = (): false | void => ref.current.focus();
    const [URLInputOpen, setURLInputOpen] = useState(false);
    const [URL, setURL] = useState('');

    const blurEditor = (): false | void => {
        ref.current.blur();
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
        setTimeout(() => {
            submitForm();
            setEditorState(EditorState.createEmpty()); // Reset editor.
            blurEditor();
        }, 0);
    };

    const getKeyBinding = (e: KeyboardEvent<{}>): string | null => {
        switch (e.keyCode) {
            // CMD + Shift + X
            case 88: {
                return hasCommandModifier(e) && e.shiftKey ? strikeThrough : null;
            }

            // CMD + Shift + U
            case 85: {
                return hasCommandModifier(e) && e.shiftKey ? link : null;
            }

            // CMD + Shift + 7
            case 55: {
                return hasCommandModifier(e) && e.shiftKey ? orderedList : null;
            }

            // CMD + Shift + 8
            case 56: {
                return hasCommandModifier(e) && e.shiftKey ? unorderedList : null;
            }

            // CMD + Shift + 9
            case 57: {
                return hasCommandModifier(e) && e.shiftKey ? blockQuote : null;
            }

            // CMD + Shift + C
            case 67: {
                return hasCommandModifier(e) && e.shiftKey ? codeBlock : null;
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
        />
    );

    const renderInlineStyles = inlineStyles.map(({ tooltip, icon: Icon, style }, i) => (
        <Tooltip key={i} title={tooltip}>
            <Typography component="span">
                <IconButton
                    {...commonToolbarButtonProps}
                    onMouseDown={toggleInlineStyle(style)}
                    color={editorState.getCurrentInlineStyle().has(style) ? 'primary' : 'default'}
                >
                    <Icon />
                </IconButton>
            </Typography>
        </Tooltip>
    ));

    const renderLinkButton = (
        <Tooltip title={t('tooltips:link', { hotkeyLink })}>
            <Typography component="span">
                <IconButton {...commonToolbarButtonProps} disabled={selectionCollapsed} onMouseDown={handleLinkPrompt}>
                    <LinkOutlined />
                </IconButton>
            </Typography>
        </Tooltip>
    );

    const renderURLInput = (
        <SkoleDialog open={URLInputOpen} onClose={handleCloseURLInput}>
            <DialogTitle>{t('forms:addLink')}</DialogTitle>
            <DialogContent>
                <TextField
                    value={URL}
                    onChange={handleLinkInputChange}
                    label={t('forms:url')}
                    placeholder={t('forms:urlPlaceholder')}
                    autoFocus
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseURLInput}>{t('common:cancel')}</Button>
                <Button onClick={confirmLink} color="primary">
                    {t('common:confirm')}
                </Button>
            </DialogActions>
        </SkoleDialog>
    );

    const renderBlockStyles = blockTypes.map(({ tooltip, icon: Icon, style }, i) => (
        <Tooltip key={i} title={tooltip}>
            <Typography component="span">
                <IconButton
                    {...commonToolbarButtonProps}
                    onMouseDown={toggleBlockStyle(style)}
                    color={style === blockType ? 'primary' : 'default'}
                >
                    <Icon />
                </IconButton>
            </Typography>
        </Tooltip>
    ));

    const renderSendButton = (
        <Box marginLeft="auto">
            <Tooltip title={t('tooltips:sendMessage')}>
                <Typography component="span">
                    <IconButton
                        {...commonToolbarButtonProps}
                        onClick={handleSubmit}
                        color={!!textContent || !!commentAttachment ? 'primary' : 'default'}
                        disabled={!textContent && !commentAttachment} // Require either text content or an attachment.
                    >
                        <SendOutlined />
                    </IconButton>
                </Typography>
            </Tooltip>
        </Box>
    );

    // TODO: Add this toolbar behind some expansion thingy as the toolbar does not fit very narrow screens.
    const renderBottomToolbar = (
        <Box marginTop={spacing(1)} display="flex" onClick={focusEditor}>
            {renderInlineStyles}
            {renderLinkButton}
            {renderBlockStyles}
            {renderSendButton}
        </Box>
    );

    const renderMentionButton = (
        <Tooltip title={t('tooltips:mention')}>
            <Typography component="span">
                <IconButton {...commonToolbarButtonProps} disabled>
                    <AlternateEmailOutlined />
                </IconButton>
            </Typography>
        </Tooltip>
    );

    const renderAttachmentButton = (
        <>
            <input
                ref={attachmentInputRef}
                value=""
                type="file"
                accept=".png, .jpg, .jpeg;capture=camera"
                onChange={handleAttachmentChange}
                disabled={!userMe}
            />
            <Tooltip title={attachmentTooltip}>
                <Typography component="span">
                    <IconButton onClick={handleUploadAttachment} {...commonToolbarButtonProps} disabled={!verified}>
                        {isMobileOrTablet ? <CameraAltOutlined /> : <AttachFileOutlined />}
                    </IconButton>
                </Typography>
            </Tooltip>
        </>
    );

    const renderClearAttachmentButton = !!commentAttachment && (
        <Tooltip title={t('tooltips:clearAttachment')}>
            <Typography component="span">
                <IconButton onClick={handleClearAttachment} {...commonToolbarButtonProps}>
                    <ClearOutlined />
                </IconButton>
            </Typography>
        </Tooltip>
    );

    const renderSendHelpText = (
        <FormHelperText>
            <b>Return</b> {t('forms:sendHelpText')}
        </FormHelperText>
    );

    const renderNewLineHelpText = (
        <FormHelperText className={classes.newLineHelpText}>
            <b>Shift + Return</b> {t('forms:newLineHelpText')}
        </FormHelperText>
    );

    const renderTopToolbarButtons = (
        <Grid item xs={12} md={3} container justify="flex-start">
            {renderMentionButton}
            {renderAttachmentButton}
            {renderClearAttachmentButton}
        </Grid>
    );

    const renderHelpTexts = isDesktop && (
        <Grid item md={9} container justify="flex-end">
            {renderSendHelpText}
            {renderNewLineHelpText}
        </Grid>
    );

    const renderTopToolbar = (
        <Box marginBottom={spacing(2)} onClick={focusEditor}>
            <Grid container alignItems="center">
                {renderTopToolbarButtons}
                {renderHelpTexts}
            </Grid>
        </Box>
    );

    return (
        <Box className={clsx(classes.root, hidePlaceholder && classes.placeholderHidden)}>
            {renderTopToolbar}
            {renderTextField}
            {renderBottomToolbar}
            {renderURLInput}
        </Box>
    );
};
