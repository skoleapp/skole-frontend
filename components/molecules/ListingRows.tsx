import React from 'react';
import * as R from 'ramda';
import Router from 'next/router';

//material-ui
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { Link } from '@material-ui/core';

//interfaces
import { FacultyRowProps, SchoolRowProps } from '../../interfaces';

export const ListingRows: React.FC<SchoolRowProps> = ({
  school,
  index,
  handleSchoolSelection,
  selectedSchool,
  selectedFaculty,
  setSelectedFaculty
}) => {
  const handleFacultySelection = (
    index: number,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    index === selectedFaculty ? setSelectedFaculty(-1) : setSelectedFaculty(index);
  };

  const faculties = R.prop('faculty', school);

  return (
    <ExpansionPanel
      square
      expanded={selectedSchool === index}
      onClick={() => handleSchoolSelection(index)}
    >
      <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">
        {R.prop('id', school)}
      </ExpansionPanelSummary>

      <ExpansionPanelDetails
        style={{
          backgroundColor: 'var(--primary)',
          padding: '0px 0px 0px 12px',
          textAlign: 'left'
        }}
      >
        <div style={{ width: '100%' }}>
          {faculties.map((faculty: any, index: number) => (
            <FacultyRow
              key={index}
              faculty={faculty}
              index={index}
              handleFacultySelection={handleFacultySelection}
              selectedFaculty={selectedFaculty}
            />
          ))}
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const FacultyRow: React.FC<FacultyRowProps> = ({
  faculty,
  index,
  handleFacultySelection,
  selectedFaculty
}) => {
  const facilities = R.prop('facility', faculty);

  const handleFacilityClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) => {
    e.stopPropagation();
    Router.push('/' + href);
  };

  return (
    <ExpansionPanel
      square
      expanded={selectedFaculty === index}
      onClick={e => handleFacultySelection(index, e)}
    >
      <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">
        {R.prop('id', faculty)}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <ul>
          {facilities.map((facility: any, index: number) => (
            <li style={{ margin: 10 }} key={index}>
              <Link
                href={R.prop('href', facility)}
                onClick={(e: any) => handleFacilityClick(e, R.prop('href', facility))}
              >
                {R.prop('id', facility)}
              </Link>
            </li>
          ))}
        </ul>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

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
