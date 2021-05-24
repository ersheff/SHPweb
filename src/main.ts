// --------------------------------------------------------------------------
// This is the Collab Hub server.
// Authors: Nick Hwang, Anthony T Marasco, Eric Sheffield
// Contact: nickthwang@gmail.com
// --------------------------------------------------------------------------

import HUB from "./HUB_class";

import { createServer } from "http";
import express  = require("express");
import { Server, Socket } from "socket.io";
import path = require("path");
import _ = require('lodash');

process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err)
  process.exit(1)
})

const SERVER_PORT = process.env.PORT || 3000;

// default data structures
const NAMESPACES: string[] = ['/hub', '/osu', '/default', '/grid'];
const rooms: string[] = ['default', 'room1', 'room2'];
const defaultRoom = ['default'];

const consoleDisplay: string = 'true';

function startServer() {
  // create a new express instance
  const app = express();
  // create http server and wrap the express app
  const httpServer = createServer(app);
  // bind socket.io to that server
  const io = new Server(httpServer, {
    allowEIO3: true,
    transports: ["websocket", "polling"],
    allowUpgrades: true,
    serveClient: true
  });

  app.use(express.static("public"));

  // The structure container
  const CH = [];

  // create socket namespaces
  for (const _space of NAMESPACES) {

    // io instance using the namespace name (name is a property of socket namespace)
    const nsp = io.of(_space);

    const _options : CHConstructorOptions = { io, consoleDisplay: true, name: nsp.name } ;

    // create new instanc of HUB with constructor options
    CH[nsp.name]= new HUB(_options);

    // register new connection to certain namespace to callback 'onNewConnection' of new HUB instance
    nsp.on('connection', (socket) => {CH[nsp.name].onNewConnection(socket)});

    // console.log(CH[nsp.name].Users);
    CH[nsp.name].Rooms = rooms; // not really using separate structure for
  }

  // important! must listen from `server`, not `app`, otherwise socket.io won't function correctly
  httpServer.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}.`));
}

startServer();
