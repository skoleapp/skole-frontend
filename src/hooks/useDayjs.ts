import 'dayjs/locale/fi';
import 'dayjs/locale/sv';
import 'dayjs/locale/en';

import dayjs, { Dayjs } from 'dayjs';
import localizableFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'lib';

dayjs.extend(localizableFormat);
dayjs.extend(relativeTime);

// Custom hook for setting dayjs locale to selected language.
export const useDayjs = (date?: string): Dayjs => {
    const { i18n } = useTranslation();
    return !!date ? dayjs(date).locale(i18n.language) : dayjs().locale(i18n.language);
};
