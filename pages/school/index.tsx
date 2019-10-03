import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { H1, MainLayout, NotFound } from '../../components';

const renderContentForSchoolType = (schoolType: string | string[]): JSX.Element => {
  switch (schoolType) {
    case 'high-school':
      return <H1>High School</H1>;
    case 'university':
      return <H1>University</H1>;
    case 'university-of-applied-sciences':
      return <H1>University of Applied Sciences</H1>;
    default:
      return <NotFound />;
  }
};

// FIXME: Add proper types for this
interface Props {
  url: string; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const School: NextPage<Props> = () => {
  const router = useRouter();
  const schoolType = router.query.school_type; // eslint-disable-line

  return <MainLayout title="School">{renderContentForSchoolType(schoolType)}</MainLayout>;
};

export default School;
