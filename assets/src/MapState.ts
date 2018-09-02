import { observable } from 'mobx';
import { createContext } from 'react';

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

export class MapState {
  @observable public pointsOfInterest: PointOfInterest[] = [];
  @observable public currentUser: User;
  @observable public sessions: Session[];
}

export const state = new MapState();
export const context = createContext(state);
