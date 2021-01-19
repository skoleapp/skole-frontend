import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowBackOutlined from '@material-ui/icons/ArrowBackOutlined';
import { useAuthContext } from 'context';
import { useMediaQueries, usePageRefQuery, useSearch } from 'hooks';
import { useTranslation } from 'lib';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { PageRef } from 'types';
import { UrlObject } from 'url';
import { urls } from 'utils';

interface Props extends IconButtonProps {
  href?: UrlObject | string | false;
  tooltip?: string | false;
}

export const BackButton: React.FC<Props> = ({ href: _href, tooltip, ...props }) => {
  const { isMobile } = useMediaQueries();
  const { t } = useTranslation();
  const { profileUrl } = useAuthContext();
  const { searchUrl } = useSearch();
  const { pathname, asPath } = useRouter();
  const query = usePageRefQuery();
  const color = isMobile ? 'secondary' : 'default';

  const homeProps = {
    dynamicHref: urls.home,
    dynamicTooltip: t('back-button-tooltips:home'),
  };

  const getProps = () => {
    switch (query.ref) {
      case PageRef.GET_STARTED: {
        return {
          dynamicHref: urls.index,
          dynamicTooltip: t('back-button-tooltips:getStarted'),
        };
      }

      case PageRef.FOR_TEACHERS: {
        if (pathname !== urls.forTeachers) {
          return {
            dynamicHref: urls.forTeachers,
            dynamicTooltip: t('back-button-tooltips:forTeachers'),
          };
        }

        return homeProps;
      }

      case PageRef.SEARCH: {
        return {
          dynamicHref: searchUrl,
          dynamicTooltip: t('back-button-tooltips:search'),
        };
      }

      //   case PageRef.COURSE: {
      //     return {
      //       dynamicHref: searchUrl,
      //       dynamicTooltip: t('back-button-tooltips:course'),
      //     };
      //   }

      //   case PageRef.RESOURCE: {
      //     return {
      //       dynamicHref: searchUrl,
      //       dynamicTooltip: t('back-button-tooltips:resource'),
      //     };
      //   }

      case PageRef.PROFILE: {
        if (!asPath.includes(profileUrl)) {
          return {
            dynamicHref: profileUrl,
            dynamicTooltip: t('back-button-tooltips:profile'),
          };
        }

        return homeProps;
      }

      case PageRef.ABOUT: {
        return {
          dynamicHref: urls.about,
          dynamicTooltip: t('back-button-tooltips:about'),
        };
      }

      default: {
        return homeProps;
      }
    }
  };

  const { dynamicHref, dynamicTooltip } = getProps();

  const href = _href || {
    pathname: R.propOr(dynamicHref, 'pathname', dynamicHref),
    query: {
      //   ...query,
      ...R.prop('query', dynamicHref),
    },
  };

  return (
    <Link href={href}>
      <Tooltip title={tooltip || dynamicTooltip}>
        <IconButton size="small" color={color} {...props}>
          <ArrowBackOutlined />
        </IconButton>
      </Tooltip>
    </Link>
  );
};
