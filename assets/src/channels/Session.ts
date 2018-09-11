import { Channel, Socket } from "phoenix";
import { User, MapState } from "../MapState";

export interface NewUserResponse {
  user: User;
  session_id: string;
}

export class Session {

  public static readonly ROOM_LOBBY = "room:lobby";

  public roomChannel: Channel;
  private socket: Socket;

  constructor(private endpoint: string, private mapState: MapState) {
  }

  public async createNewUser(user: User): Promise<NewUserResponse> {
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

    this.socket.connect();
    this.roomChannel = this.socket.channel(`room:${json.session_id}`, {});
    this.roomChannel.join();
    this.bindCallbacks();

    return {
      session_id: json.session_id,
      user: {
        ...user,
        id: json.user_id,
      },
    };
  }

  public async addMarker(coordinates: { lat: number, lng: number }) {
    return await this.promisifyChannelPushCall<void>("new_coordinates", coordinates);
  }

  private bindCallbacks() {
    this.roomChannel.on("new_entry", (entry) => {
      console.log('Creating new entry', entry);
      this.mapState.createCoordinate(entry);
    });
  }

  private promisifyChannelPushCall<T>(message: string, payload: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.roomChannel.push(message, payload)
        .receive("ok", (res) => resolve(res as T))
        .receive("error", (err) => reject(err));
    });
  }

}
