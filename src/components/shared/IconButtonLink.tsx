import { IconButton } from '@material-ui/core';
import { IconButtonProps } from '@material-ui/core/IconButton';
import { SvgIconComponent } from '@material-ui/icons';
import { LinkProps } from 'next/link';
import React from 'react';

import { Link } from '../../i18n';

interface Props extends IconButtonProps, LinkProps {
    icon: SvgIconComponent;
}

export const IconButtonLink: React.FC<Props> = ({ href, as, icon: Icon, ...props }) => (
    <Link href={href} as={as}>
        <IconButton {...props}>
            <Icon />
        </IconButton>
    </Link>
);
