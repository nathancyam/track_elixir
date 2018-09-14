import { Channel, Socket } from "phoenix";
import { User } from "../MapState";
import { Store, AnyAction } from "redux";
import { AppState, AppActions, applicationActions } from "../modules/Application";

export interface NewUserResponse {
  user: User;
  session_id: string;
}

export interface SyncResponse {
  users: Array<{ name: string, id: string }>,
  points_of_interest: Array<{ user: string, notes: string, name: string, longitude: number, latitude: number }>;
  id: string;
}

export class Session {

  public static readonly ROOM_LOBBY = "room:lobby";

  public roomChannel: Channel;
  private socket: Socket;

  constructor(private endpoint: string, private store: Store<{ application: AppState }, AppActions | AnyAction>) {
  }

  public async createNewUserAndSession(user: User, sessionId: string | null = null): Promise<NewUserResponse> {
    const response = await fetch('http://localhost:4000/api/user', {
      body: JSON.stringify({ name: user.name }),
      headers: {
        'Access-Control-Request-Headers': 'Content-Type',
        'Access-Control-Request-Method': 'POST',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const json = await response.json() as { session_id: string, token: string, user_id: string };

    this.socket = new Socket(this.endpoint, {
      params: {
        Authorization: `Bearer ${json.token}`,
      },
    });

    sessionId = sessionId ? sessionId : json.session_id;

    this.socket.connect();
    this.roomChannel = this.socket.channel(`room:${sessionId}`, {});
    this.roomChannel.join();
    this.bindCallbacks();

    return {
      session_id: sessionId,
      user: {
        ...user,
        id: json.user_id,
      },
    };
  }

  public async addMarker(coordinates: { lat: number, lng: number }) {
    return await this.promisifyChannelPushCall<void>("new_coordinates", coordinates);
  }

  public async sync() {
    const sync = await this.promisifyChannelPushCall<SyncResponse>("sync");
    sync.points_of_interest.forEach(p => {
      this.store.dispatch(applicationActions.createCoordinate({
        lat: p.latitude,
        lng: p.longitude,
      }));
    });
  }

  private bindCallbacks() {
    this.roomChannel.on("new_entry", (entry) => {
      this.store.dispatch(applicationActions.createCoordinate(entry));
    });
  }

  private promisifyChannelPushCall<T>(message: string, payload?: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.roomChannel.push(message, payload)
        .receive("ok", (res) => resolve(res as T))
        .receive("error", (err) => reject(err));
    });
  }

}
