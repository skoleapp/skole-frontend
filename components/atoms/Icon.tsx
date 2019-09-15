import React from 'react';

interface Props {
  iconName: string;
}

export const Icon: React.FC<Props> = ({ iconName }) => <i className={`fas fa-3x fa-${iconName}`} />;
