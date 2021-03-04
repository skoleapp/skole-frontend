import 'dayjs/locale/en';
import 'dayjs/locale/fi';
import 'dayjs/locale/sv';

import dayjs, { Dayjs } from 'dayjs';
import localizableFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'lib';

dayjs.extend(localizableFormat);
dayjs.extend(relativeTime);

// Custom hook for setting dayjs locale to selected language.
export const useDayjs = (date: string): Dayjs => {
  const { lang } = useTranslation();
  return dayjs(date).locale(lang);
};
