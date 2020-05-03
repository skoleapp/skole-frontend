import moment, { Moment, MomentFormatSpecification, MomentInput } from 'moment';
import { useTranslation } from 'react-i18next';

type UseMoment = (inp?: MomentInput, format?: MomentFormatSpecification, strict?: boolean) => Moment;

export const useMoment = (): UseMoment => {
    const { i18n } = useTranslation();
    moment.locale(i18n.language);
    return moment;
};
