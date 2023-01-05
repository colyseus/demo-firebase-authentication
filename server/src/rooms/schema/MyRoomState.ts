import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {

  @type("string")
  accessToken: string;

}

export class GameState extends Schema {

  @type({map: Player})
  players = new MapSchema<Player>();
}
