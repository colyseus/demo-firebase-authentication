import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string")
  uid: string;
}

export class MyRoomState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
}
