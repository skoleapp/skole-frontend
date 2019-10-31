import React from 'react';
import Link from 'next/link';
import * as R from 'ramda';

//material-ui
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { Link as MaterialLink } from '@material-ui/core';

//interfaces
import { SubjectRowProps, SchoolRowProps } from '../../interfaces';

import styled from 'styled-components';
export const SchoolRows: React.FC<SchoolRowProps> = ({
  school,
  index,
  selectedSchool,
  handleSchoolSelection
}) => {
  const subjects = R.prop('subjects', school);
  const schoolName = R.prop('name', school);
  const schoolId = R.prop('id', school);

  const isExpanded = selectedSchool === index ? true : false;

  return (
    <ExpansionPanel square expanded={isExpanded} onClick={() => handleSchoolSelection(index)}>
      <ExpansionPanelSummary>
        <StyledSchoolName expanded={isExpanded}>{schoolName}</StyledSchoolName>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails
        style={{
          backgroundColor: 'var(--primary)',
          padding: '0px 0px 0px 12px',
          textAlign: 'left'
        }}
      >
        <div style={{ width: '100%' }}>
          {subjects.map((subject: any, index: number) => (
            <SubjectRow key={index} subject={subject} schoolName={schoolName} schoolId={schoolId} />
          ))}
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const SubjectRow: React.FC<SubjectRowProps> = ({ subject, schoolName, schoolId }) => {
  const subjectName = R.prop('name', subject);

  const handleDummyClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  return (
    <ExpansionPanel expanded square onClick={e => handleDummyClick(e)}>
      <ExpansionPanelSummary style={{ cursor: 'auto' }}>
        <Link href={{ pathname: '/search', query: { schoolName, subjectName } }}>
          <StyledLink href={schoolId + '/' + subjectName} color="primary">
            {subjectName}
          </StyledLink>
        </Link>
      </ExpansionPanelSummary>
    </ExpansionPanel>
  );
};

interface Props {
  expanded: boolean;
}

const StyledSchoolName = styled.div<Props>`
  transition: var(--slowTransition);
  font-size: ${({ expanded }): any => (expanded ? '1.2rem' : '0.875rem')};
`;

const StyledLink = styled(MaterialLink)`
  cursor: pointer;
`;

// get rid of these pls for the sake of god
const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 'auto'
    }
  },
  expanded: {}
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56
    }
  },
  content: {
    '&$expanded': {
      margin: '12px 0'
    }
  },
  expanded: {}
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles({})(MuiExpansionPanelDetails);
