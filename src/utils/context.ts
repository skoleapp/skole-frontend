import { useContext } from 'react';
import { SkoleContext } from 'src/context';

import {
    AttachmentViewer,
    CommentThread,
    LanguageSelector,
    Notifications,
    PDFViewer,
    Settings,
    SkoleContextType,
} from '../types';

export const useSkoleContext = (): SkoleContextType => useContext(SkoleContext);
export const useAttachmentViewerContext = (): AttachmentViewer => useSkoleContext().attachmentViewer;
export const useCommentThreadContext = (): CommentThread => useSkoleContext().commentThread;
export const useLanguageSelectorContext = (): LanguageSelector => useSkoleContext().languageSelector;
export const useNotificationsContext = (): Notifications => useSkoleContext().notifications;
export const useSettingsContext = (): Settings => useSkoleContext().settings;
export const usePDFViewerContext = (): PDFViewer => useSkoleContext().pdfViewer;
