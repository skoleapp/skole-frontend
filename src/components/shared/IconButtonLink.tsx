import { IconButton } from '@material-ui/core';
import { IconButtonProps } from '@material-ui/core/IconButton';
import { Link } from '../../i18n';
import { LinkProps } from 'next/link';
import React from 'react';
import { SvgIconComponent } from '@material-ui/icons';

interface Props extends IconButtonProps, LinkProps {
    icon: SvgIconComponent;
}

export const IconButtonLink: React.FC<Props> = ({ href, icon: Icon, ...props }) => (
    <Link href={href}>
        <IconButton {...props}>
            <Icon />
        </IconButton>
    </Link>
);
