import { InputLabel, MenuItem, Select } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { Subject } from '../interfaces';

interface Props {
  subjects: Subject[];
  initialValue?: number;
  id: number;
}

export const CourseSelectFilter: React.FC<Props> = ({ subjects, initialValue = 'all', id }) => {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  const handleFilterChange = (e: ChangeEvent<any>) => {
    let newValue = e.target.value;

    if (value !== newValue) {
      let query;

      if (newValue !== 'all') {
        query = { subjectId: newValue };
      }

      router.push({
        pathname: `/schools/${id}/courses/`,
        query
      });

      setValue(newValue);
    }
  };

  return (
    <StyledCourseSelectFilter>
      <InputLabel>Filter by Subject</InputLabel>
      <Select value={value} onChange={handleFilterChange}>
        <MenuItem value="all">All</MenuItem>
        {subjects.map((s: Subject, i: number) => (
          <MenuItem value={s.id} key={i}>
            {s.name}
          </MenuItem>
        ))}
      </Select>
    </StyledCourseSelectFilter>
  );
};

const StyledCourseSelectFilter = styled.div`
  margin-top: 0.5rem;

  .MuiSelect-root {
    min-width: 4rem;
    margin-top: 0.25rem;
  }

  .MuiInputLabel-root {
    font-size: 0.75rem;
  }
`;
