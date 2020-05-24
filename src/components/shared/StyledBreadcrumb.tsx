import { Chip } from '@material-ui/core';
import React from 'react';
import { StyledBreadcrumbProps } from 'src/types';
import styled from 'styled-components';

import { Link } from '../../i18n';

export const StyledBreadcrumb: React.FC<StyledBreadcrumbProps> = ({ linkProps, chipProps }) => (
    <Link {...linkProps} passHref>
        <StyledStyledBreadcrumb {...chipProps} />
    </Link>
);

const StyledStyledBreadcrumb = styled(Chip)`
    height: 1.5rem !important;
`;
