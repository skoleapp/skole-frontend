import { MenuItem, Select } from '@material-ui/core';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { breakpoints } from '../../styles';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const countries = [
    { code: 'US', label: 'languages:english', value: 'en' },
    { code: 'FI', label: 'languages:finnish', value: 'fi' },
    { code: 'SE', label: 'languages:swedish', value: 'sv' },
];

interface Props {
    secondary?: boolean;
}

export const LanguageSelector: React.FC<Props> = ({ secondary }) => {
    const { t, i18n } = useTranslation();
    const [value, setValue] = useState(i18n.language);

    // Listen for language changes outside this selector and update the state accordingly.
    useEffect(() => {
        setValue(i18n.language);
    }, [i18n.language]);

    const handleChange = (e: ChangeEvent<{}>): void => {
        const newValue = (e as ChangeEvent<HTMLSelectElement>).target.value;
        setValue(newValue);
        i18n.changeLanguage(newValue);
    };

    const countryToFlag = (isoCode: string): string => {
        return typeof String.fromCodePoint !== 'undefined'
            ? isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
            : isoCode;
    };

    return (
        <StyledLanguageSelector
            secondary={secondary}
            value={value}
            onChange={handleChange}
            variant="outlined"
            fullWidth
        >
            {countries.map((c, i) => (
                <MenuItem key={i} value={c.value}>
                    <span>{countryToFlag(c.code)}</span> {t(c.label)}
                </MenuItem>
            ))}
        </StyledLanguageSelector>
    );
};

interface StyledLanguageSelectorProps {
    secondary?: boolean;
}

const StyledLanguageSelector = styled(Select)<StyledLanguageSelectorProps>`
    height: 2.5rem;
    margin: 0.5rem;
    color: ${({ secondary }): string => (secondary ? 'var(--white) !important' : 'inherit')};

    @media only screen and (min-width: ${breakpoints.SM}) {
        max-width: 10rem;
    }
`;
