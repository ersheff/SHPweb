class HUB {
    Users: Map<string, CHUserDetails>;
    Controls: CHControl[];
    Events: CHEvent [];
    Rooms: {};
    /**
     * @property {Map<string, CHUserDetails>} Users - an Map of connected Users // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
     * @property {CHControl[]} Controls - an object array of all available control data
     * @property {CHEvent[]} Events - an object array of all available event data
     * @property {object[]} Rooms - a string array of available Rooms
     */
    constructor() {
      this.Users = new Map();
      this.Controls = [];
      this.Events = [];
      this.Rooms = {};
    //   const defaultRooms = rooms;
    }
  }
