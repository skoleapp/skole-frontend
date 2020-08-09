import { UserObjectType } from 'generated';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { Context, createContext, useState } from 'react';
import { useContext } from 'react';
import { AuthContextType } from 'types';

const AuthContext = createContext<AuthContextType | null>(null);

interface UseAuthContext extends AuthContextType {
    verified: boolean | null;
    verificationRequiredTooltip: string | false;
}

export const useAuthContext = (): UseAuthContext => {
    const { t } = useTranslation();
    const { userMe, setUserMe } = useContext(AuthContext as Context<AuthContextType>);
    const verified = R.propOr(null, 'verified', userMe) as boolean | null;
    const verificationRequiredTooltip = verified === false && t('tooltips:verificationRequired');
    return { userMe, setUserMe, verified, verificationRequiredTooltip };
};

export const AuthContextProvider: React.FC = ({ children }) => {
    const [userMe, setUserMe] = useState<UserObjectType | null>(null);
    const value = { userMe, setUserMe };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
