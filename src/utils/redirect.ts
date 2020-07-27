import { Router } from 'i18n';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { UrlObject } from 'url';

export const redirect = (location: string | UrlObject, ctx?: GetServerSidePropsContext<ParsedUrlQuery>): void => {
    if (!!ctx && !!ctx.res) {
        ctx.res.writeHead(302, { Location: location as string });
        ctx.res.end();
    } else {
        Router.push(location);
    }
};
