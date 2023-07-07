import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { Room, Client } from "colyseus";

import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

  onCreate (options: any) {
    this.setState(new MyRoomState());
    console.log("room", this.roomId, "created!");
  }

  async onAuth(client: Client, options: any) {
    return await getAuth().verifyIdToken(options.accessToken);
  }

  onJoin (client: Client, options: any, authData: DecodedIdToken) {
    const player = new Player();
    player.uid = authData.uid;

    this.state.players.set(client.sessionId, player);
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
