import { getAuth } from "firebase-admin/auth";

import { Room, Client, ServerError } from "colyseus";
import { IncomingMessage } from "http";
import { GameState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<GameState> {

  async onAuth(client: Client, options: any, request?: IncomingMessage) {
    try {
      return await getAuth().verifyIdToken(options.accessToken);
    } catch(e) {
      throw new ServerError(400, "bad access token");
    }
  }

  onCreate (options: any) {
    this.setState(new GameState());
  }

  onJoin (client: Client, options: any) {
    const player = new Player();
    player.accessToken = options.accessToken;
    this.state.players.set(client.sessionId,player);
    
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
