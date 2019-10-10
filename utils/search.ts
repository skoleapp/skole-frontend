interface Params {
  search?: string;
  school_type?: string;
}

// eslint-disable-next-line @typescript-eslint/camelcase
export const getQueryParams = ({ search, school_type }: Params): string | undefined => {
  if (search) {
    return `?search=${search}`;
  }

  // eslint-disable-next-line @typescript-eslint/camelcase
  if (school_type) {
    return `?search=${school_type}`; // eslint-disable-line @typescript-eslint/camelcase
  }
};
