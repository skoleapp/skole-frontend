import { useRouter } from 'next/router';
import React from 'react';
import { H1, MainLayout, NotFound, ListingPage } from '../../components';

const renderContentForSchoolType = (schoolType: string | string[]): JSX.Element => {
  switch (schoolType) {
    case 'high-school':
      return <H1>High School</H1>;
    case 'university':
      return <ListingPage schoolType={schoolType}></ListingPage>;
    case 'university-of-applied-sciences':
      return <H1>University of Applied Sciences</H1>;
    default:
      return <NotFound />;
  }
};

const School: React.FC = () => {
  const router = useRouter();
  const schoolType = router.query.school_type; // eslint-disable-line

  return <MainLayout title="School">{renderContentForSchoolType(schoolType)}</MainLayout>;
};

export default School;
