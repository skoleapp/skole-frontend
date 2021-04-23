import { useTranslation } from 'lib';
import Router, { useRouter } from 'next/router';
import React, { createContext, useContext } from 'react';
import { OrderingContextType, SetOrderingParams } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const OrderingContext = createContext<OrderingContextType>({});

export const useOrderingContext = (): OrderingContextType => useContext(OrderingContext);

export const OrderingContextProvider: React.FC = ({ children }) => {
  const { t } = useTranslation();
  const { query } = useRouter();

  const ordering = ['newest', 'best'].includes(String(query.ordering))
    ? String(query.ordering)
    : 'best';

  const orderingLabel = ordering === 'newest' ? t('common:newest') : t('common:best');

  // The URL must be encoded manually, because Next router encodes the query params as hexadecimals.
  const setOrdering = ({ pathname, ordering }: SetOrderingParams): Promise<boolean> =>
    Router.push(`${process.env.FRONTEND_URL}${pathname}?ordering=${ordering}`, undefined, {
      shallow: true,
    });

  const value = {
    ordering,
    orderingLabel,
    setOrdering,
  };

  return <OrderingContext.Provider value={value}>{children}</OrderingContext.Provider>;
};
