import { useTranslation } from 'lib';

import 'dayjs/locale/fi';
import 'dayjs/locale/sv';
import 'dayjs/locale/en';
import dayjs from 'dayjs';
import localizableFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(localizableFormat);
dayjs.extend(relativeTime);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useDayjs = (date: string | undefined = undefined) => {
    const { i18n } = useTranslation();

    if (!!date) {
        return dayjs(date).locale(i18n.language);
    }
    return dayjs().locale(i18n.language);
};
