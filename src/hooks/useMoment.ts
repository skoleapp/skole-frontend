import { useTranslation } from 'lib';
import moment from 'moment';

// Ignore: Moment instance will get its types automatically.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useMoment = () => {
    const { i18n } = useTranslation();
    moment.locale(i18n.language);
    return moment;
};
