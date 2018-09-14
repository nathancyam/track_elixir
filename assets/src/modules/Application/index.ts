import { Action } from 'redux';
import { NewUserResponse } from '../../channels/Session';

interface PointOfInterest {
  name: string;
  lat: string;
  long: string;
}

export interface User {
  id: string;
  name: string;
}

interface Session {
  id: string;
}

export interface AppState {
  readonly activeSession: Session | null;
  readonly currentUser: User | null;
  readonly pointsOfInterests: PointOfInterest[];
}

const initialState: AppState = {
  activeSession: null,
  currentUser: null,
  pointsOfInterests: [],
};

interface NewUserResponseAction extends Action {
  newUserResponse: NewUserResponse;
  type: 'NEW_SESSION';
}

interface NewCoordinateAction extends Action {
  newCoordinate: { lat: number, lng: number };
  type: 'NEW_COORDINATE';
}

export type AppActions = NewUserResponseAction | NewCoordinateAction;

export const applicationActions = {
  createSession(newUserResponse: NewUserResponse): NewUserResponseAction {
    return {
      newUserResponse,
      type: 'NEW_SESSION',
    }
  },
  createCoordinate(coordinate: { lat: number, lng: number }): NewCoordinateAction {
    return {
      newCoordinate: coordinate,
      type: 'NEW_COORDINATE',
    }
  }
};

export function applicationReducer(state: AppState = initialState, action: AppActions): AppState {
  switch(action.type) {
    case 'NEW_SESSION': {
      const newState = {
        ...state,
        activeSession: { id: action.newUserResponse.session_id },
        currentUser: action.newUserResponse.user,
      };

      return newState;
    }

    case 'NEW_COORDINATE': {
      return {
        ...state,
        pointsOfInterests: [
          ...state.pointsOfInterests,
          {
            lat: action.newCoordinate.lat.toString(),
            long: action.newCoordinate.lng.toString(),
            name: '',
          },
        ]
      }
    }
  }

  return state;
}
