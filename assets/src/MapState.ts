import { observable, action, computed } from 'mobx';
import { createContext } from 'react';
import { NewUserResponse } from './channels/Session';

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
  @observable public sessions: Session[] = [];

  @computed public get loggedIn(): boolean {
    console.log('isloggedin', this.currentUser);
    return this.currentUser != null;
  }

  @action public createSession(payload: NewUserResponse): void {
    this.currentUser = payload.user;
    this.sessions.push({ id: payload.session_id });
  }

  @action public createCoordinate(coordinate: { lat: number, lng: number }) {
    this.pointsOfInterest.push({
      lat: coordinate.lat.toString(),
      long: coordinate.lng.toString(),
      name: '',
    });
  }
}

export const state = new MapState();
export const context = createContext(state);
