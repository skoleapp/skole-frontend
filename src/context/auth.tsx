import { UserObjectType } from 'generated';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { Context, createContext, useState } from 'react';
import { useContext } from 'react';
import { AuthContextType } from 'types';

const AuthContext = createContext<AuthContextType | null>(null);

interface UseAuthContext extends AuthContextType {
    verified: boolean | null;
    loginRequiredTooltip: string | false;
    verificationRequiredTooltip: string | false;
}

export const useAuthContext = (): UseAuthContext => {
    const { t } = useTranslation();
    const { userMe, setUserMe, ...authContext } = useContext(AuthContext as Context<AuthContextType>);
    const verified = R.propOr(null, 'verified', userMe) as boolean | null;
    const loginRequiredTooltip = !userMe && t('tooltips:loginRequired');
    const verificationRequiredTooltip = verified === false && t('tooltips:verificationRequired');
    return { userMe, setUserMe, verified, verificationRequiredTooltip, loginRequiredTooltip, ...authContext };
};

export const AuthContextProvider: React.FC = ({ children }) => {
    const [userMe, setUserMe] = useState<UserObjectType | null>(null);
    const [authNetworkError, setAuthNetworkError] = useState(false);
    const value = { userMe, setUserMe, authNetworkError, setAuthNetworkError };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
