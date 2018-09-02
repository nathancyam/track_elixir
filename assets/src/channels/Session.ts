import { Channel, Socket } from "phoenix";
import { User } from "../MapState";

interface NewUserResponse {
  user: User;
  session_id: string;
}

export class Session {

  public static readonly ROOM_LOBBY = "room:lobby";

  public readonly roomChannel: Channel;

  private readonly socket: Socket;

  constructor(endpoint: string) {
    this.socket = new Socket(endpoint);
    this.socket.connect();
    this.roomChannel = this.socket.channel(Session.ROOM_LOBBY, {});
    this.roomChannel.join();
  }

  public async createNewUser(user: User): Promise<NewUserResponse> {
    return await this.promisifyChannelPushCall<NewUserResponse>("new_user", {
      user: { name: user.name }
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
