import { useTranslation } from 'lib';
import React, { createContext, useContext, useState } from 'react';
import { Ordering, OrderingContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const OrderingContext = createContext<OrderingContextType>({});

export const useOrderingContext = (): OrderingContextType => useContext(OrderingContext);

export const OrderingContextProvider: React.FC = ({ children }) => {
  const { t } = useTranslation();
  const [ordering, setOrdering] = useState<Ordering>('best');
  const orderingLabel = ordering === 'newest' ? t('common:newest') : t('common:best');

  const value = {
    ordering,
    setOrdering,
    orderingLabel,
  };

  return <OrderingContext.Provider value={value}>{children}</OrderingContext.Provider>;
};
