import { AnyAction } from 'redux';
import { Universities, AMKs, HighSchools } from '../utils/schools';

// TODO: add constants

export const initialSchoolListingState: SchoolListingState = {
  selectedSchoolTypeString: 'University',
  selectedSchoolType: Universities,
  selectedSchool: null,
  selectedFaculty: null
};

export default (state = initialSchoolListingState, action: AnyAction): SchoolListingState => {
  switch (action.type) {
    case 'selectedSchool': {
      return {
        ...state,
        selectedSchool: action.payload
      };
    }
    case 'selectedSchoolType': {
      switch (action.schoolTypeString) {
        case 'University': {
          return {
            ...state,
            selectedSchool: null,
            selectedFaculty: null,
            selectedSchoolTypeString: action.schoolTypeString,
            selectedSchoolType: Universities
          };
        }

        case 'AMKs': {
          return {
            ...state,
            selectedSchool: null,
            selectedFaculty: null,
            selectedSchoolTypeString: action.schoolTypeString,
            selectedSchoolType: AMKs
          };
        }

        case 'HighSchools': {
          return {
            ...state,
            selectedSchool: null,
            selectedFaculty: null,
            selectedSchoolTypeString: action.schoolTypeString,
            selectedSchoolType: HighSchools
          };
        }

        default: {
          return state;
        }
      }
    }
    case 'selectedFaculty': {
      return {
        ...state,
        selectedFaculty: action.payload
      };
    }
    case 'resetSchoolListing': {
      return {
        ...initialSchoolListingState
      };
    }
    default:
      return state;
  }
};
