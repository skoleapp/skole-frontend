import { IconButton } from '@material-ui/core';
import { IconButtonProps } from '@material-ui/core/IconButton';
import { SvgIconComponent } from '@material-ui/icons';
import { Link } from 'i18n';
import { LinkProps } from 'next/link';
import React, { forwardRef } from 'react';

interface Props extends IconButtonProps, LinkProps {
    icon: SvgIconComponent;
}

export const IconButtonLink = forwardRef<HTMLButtonElement, Props>(({ href, as, icon: Icon, ...props }, ref) => (
    <Link href={href} as={as}>
        <IconButton {...props} ref={ref}>
            <Icon />
        </IconButton>
    </Link>
));
