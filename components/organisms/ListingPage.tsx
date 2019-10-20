import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as R from 'ramda';
import { Anchor } from '../atoms';
import Router from 'next/router';

import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

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
interface SchoolRowProps {
  index: number;
  school: any;
  handleSchoolSelection: (index: number) => void;
  selectedSchool: number;
  selectedFaculty: number;
  dispatch: (any) => void;
}
interface FacultyRowProps {
  key: string | number;
  index: number;
  faculty: any;
  handleFacultySelection: (index: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  selectedFaculty: number;
}

const handleFacilityClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
  e.stopPropagation();
  console.log('yes');
  Router.push('/' + href);
};

const FacultyRow: React.FC<FacultyRowProps> = ({
  faculty,
  index,
  handleFacultySelection,
  selectedFaculty
}) => {
  const facilities = R.prop('facility', faculty);

  return (
    <ExpansionPanel
      square
      expanded={selectedFaculty === index}
      onClick={e => handleFacultySelection(index, e)}
    >
      <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">
        <Typography>{R.prop('id', faculty)}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <ul>
          {facilities.map((facility: any, index: number) => (
            <li style={{ margin: 10 }} key={index}>
              <Anchor
                href={R.prop('href', facility)}
                onClick={e => handleFacilityClick(e, R.prop('href', facility))}
              >
                {R.prop('id', facility)}
              </Anchor>
            </li>
          ))}
        </ul>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const SchoolRow: React.FC<SchoolRowProps> = ({
  school,
  index,
  handleSchoolSelection,
  selectedSchool,
  selectedFaculty,
  dispatch
}) => {
  const handleFacultySelection = (
    index: number,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    index === selectedFaculty
      ? dispatch({ type: 'selectedFaculty', payload: null })
      : dispatch({ type: 'selectedFaculty', payload: index });
  };

  const faculties = R.prop('faculty', school);

  return (
    <ExpansionPanel
      square
      expanded={selectedSchool === index}
      onClick={() => handleSchoolSelection(index)}
    >
      <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">
        <Typography>{R.prop('id', school)}</Typography>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails
        style={{
          backgroundColor: 'var(--primary)',
          padding: '0px 0px 0px 12px',
          textAlign: 'left'
        }}
      >
        <Typography style={{ width: '100%' }}>
          {faculties.map((faculty: any, index: number) => (
            <FacultyRow
              key={index}
              faculty={faculty}
              index={index}
              handleFacultySelection={handleFacultySelection}
              selectedFaculty={selectedFaculty}
            />
          ))}
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export const ListingPage: React.FC = () => {
  const {
    selectedSchoolTypeString,
    selectedSchoolType,
    selectedSchool,
    selectedFaculty
  } = useSelector(state => state.schoolListing);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch({ type: 'resetSchoolListing' });
    };
  }, []);

  const handleSwitch = (event: React.MouseEvent<HTMLElement>, newSchoolType: any) => {
    dispatch({ type: 'selectedSchoolType', schoolTypeString: newSchoolType });
  };

  const handleSchoolSelection = (index: number) => {
    index === selectedSchool
      ? dispatch({ type: 'selectedSchool', payload: null })
      : dispatch({ type: 'selectedSchool', payload: index });
  };

  return (
    <div style={{ marginTop: '20px', border: '2px solid #e0e0e0' }}>
      <div style={{ width: '100%', display: 'flex' }}>
        <input style={{ flex: '0 0 30%' }}></input>
        <ToggleButtonGroup
          style={{
            width: '100%',
            display: 'flex',
            backgroundColor: 'white',
            justifyContent: 'flex-end'
          }}
          value={selectedSchoolTypeString}
          exclusive
          onChange={handleSwitch}
        >
          <ToggleButton style={{ width: '100%' }} color="black" value="University">
            Universities
          </ToggleButton>
          <ToggleButton style={{ width: '100%' }} value="AMKs">
            Universities of Applied Sciences
          </ToggleButton>
          <ToggleButton style={{ width: '100%' }} value="HighSchools">
            High Schools
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      {selectedSchoolType.map((school: any, index: number) => (
        <SchoolRow
          key={index}
          school={school}
          index={index}
          handleSchoolSelection={handleSchoolSelection}
          selectedSchool={selectedSchool}
          dispatch={dispatch}
          selectedFaculty={selectedFaculty}
        />
      ))}
    </div>
  );
};
