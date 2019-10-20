import React, { useState } from "react";
import * as R from "ramda";
import { Anchor } from "../atoms";
import Router from "next/router";

import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";

const schools = [
  {
    id: "Turun yliopisto",
    faculty: [
      { id: "Humanistinen tiedekunta", facility: [] },
      { id: "Kasvatustieteiden tiedekunta", facility: [] },
      {
        id: "Luonnontieteiden ja tekniikan tiedekunta",
        facility: [
          { id: "Biokemian laitos", href: "dtek609_kallu" },
          { id: "Biologian laitos" },
          { id: "Fysiikan ja tähtitieteen laitos" },
          { id: "Kemian laitos" },
          { id: "Maantieteen ja geologian laitos" },
          { id: "Matematiikan ja tilastotieteen laitos" },
          { id: "Tulevaisuuden teknologioiden laitos" }
        ]
      },
      { id: "Lääketieteellinen tiedekunta", facility: [] },
      { id: "Oikeustieteellinen tiedekunta", facility: [] },
      { id: "Turun kauppakorkeakoulu", facility: [] },
      { id: "Yhteiskuntatieteellinen tiedekunta", facility: [] }
    ]
  },
  {
    id: "Åbo Akademi",
    faculty: [{ id: "Department of Gender Studies", facility: [{ id: " " }] }]
  },
  {
    id: "Aalto-yliopisto",
    faculty: [
      { id: "lute", facility: [{ id: "" }] },
      { id: "kauppis", facility: [{ id: "" }] }
    ]
  },
  {
    id: "Helsingin yliopisto",
    faculty: [
      { id: "lute", facility: [{ id: "" }] },
      { id: "kauppis", facility: [{ id: "" }] }
    ]
  },
  {
    id: "Tampereen teknillinen yliopisto",
    faculty: [
      { id: "lute", facility: [{ id: "" }] },
      { id: "kauppis", facility: [{ id: "" }] }
    ]
  },
  {
    id: "Oulun yliopisto",
    faculty: [
      { id: "lute", facility: [{ id: "" }] },
      { id: "kauppis", facility: [{ id: "" }] }
    ]
  },
  {
    id: "Vaasan yliopisto",
    faculty: [
      { id: "lute", facility: [{ id: "" }] },
      { id: "kauppis", facility: [{ id: "" }] }
    ]
  },
  {
    id: "Lappeenrannan–Lahden teknillinen yliopisto",
    faculty: [
      { id: "lute", facility: [{ id: "" }] },
      { id: "kauppis", facility: [{ id: "" }] }
    ]
  }
];

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {}
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56
    }
  },
  content: {
    "&$expanded": {
      margin: "12px 0"
    }
  },
  expanded: {}
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles({})(MuiExpansionPanelDetails);

interface Props {
  schoolType: string;
}
interface SchoolRowProps {
  index: number;
  school: any;
  handleSchoolSelection: (index: number) => void;
  selectedSchool: number;
}
interface FacultyRowProps {
  key: string | number;
  index: number;
  faculty: any;
  handleFacultySelection: (
    index: number,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  selectedFaculty: number;
}

const handleFacilityClick = (
  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  href: string
) => {
  e.stopPropagation();
  console.log("yes");
  Router.push("/" + href);
};

const FacultyRow: React.FC<FacultyRowProps> = ({
  faculty,
  index,
  handleFacultySelection,
  selectedFaculty
}) => {
  const isExpanded = selectedFaculty === index ? true : false;

  const facilities = R.prop("facility", faculty);

  return (
    <ExpansionPanel
      square
      expanded={selectedFaculty === index}
      onClick={e => handleFacultySelection(index, e)}
    >
      <ExpansionPanelSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
      >
        <Typography>{R.prop("id", faculty)}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <ul>
          {facilities.map((facility: any, index: number) => (
            <li style={{ margin: 10 }} key={index}>
              <Anchor
                href={R.prop("href", facility)}
                onClick={e => handleFacilityClick(e, R.prop("href", facility))}
              >
                {R.prop("id", facility)}
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
  selectedSchool
}) => {
  const isExpanded = selectedSchool === index ? true : false;

  const [selectedFaculty, setSelectedFaculty] = useState();
  const handleFacultySelection = (
    index: number,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (index === selectedFaculty) {
      setSelectedFaculty(null);
    } else {
      setSelectedFaculty(index);
    }
  };

  const faculties = R.prop("faculty", school);

  return (
    <ExpansionPanel
      square
      expanded={selectedSchool === index}
      onClick={() => handleSchoolSelection(index)}
    >
      <ExpansionPanelSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
      >
        <Typography>{R.prop("id", school)}</Typography>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails
        style={{
          backgroundColor: "var(--primary)",
          padding: "0px 0px 0px 12px",
          textAlign: "left"
        }}
      >
        <Typography style={{ width: "100%" }}>
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

export const ListingPage: React.FC<Props> = () => {
  const [selectedSchool, setSelectedSchool] = useState();

  const handleSchoolSelection = (index: number) => {
    if (index === selectedSchool) {
      setSelectedSchool(null);
    } else {
      setSelectedSchool(index);
    }
  };
  return (
    <div style={{ marginTop: "20px", border: "2px solid #e0e0e0" }}>
      {schools.map((school: any, index: number) => (
        <SchoolRow
          key={index}
          school={school}
          index={index}
          handleSchoolSelection={handleSchoolSelection}
          selectedSchool={selectedSchool}
        />
      ))}
    </div>
  );
};
