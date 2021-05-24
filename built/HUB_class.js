"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHMessageType = exports.Mode = void 0;
const _ = require("lodash");
var Mode;
(function (Mode) {
    Mode["PUSH"] = "push";
    Mode["PUBLISH"] = "publish";
})(Mode = exports.Mode || (exports.Mode = {}));
var CHMessageType;
(function (CHMessageType) {
    CHMessageType["CONTROL"] = "control";
    CHMessageType["EVENT"] = "event";
    CHMessageType["MESSAGE"] = "message";
    CHMessageType["ROOMS"] = "room";
    CHMessageType["SELF"] = "self";
    CHMessageType["CHAT"] = "chat";
    CHMessageType["LIST"] = "list";
    CHMessageType["FROMSERVER"] = "fromserver";
    CHMessageType["ERROR"] = "error";
})(CHMessageType = exports.CHMessageType || (exports.CHMessageType = {}));
class HUB {
    /**
     * @property {CHUser} Users - an Map of connected Users // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
     * @property {CHControl[]} Controls - an object array of all available control data
     * @property {CHEvent[]} Events - an object array of all available event data
     * @property {object[]} Rooms - a string array of available Rooms
     */
    constructor(options) {
        this.modeHandler = (_mode, fallback) => {
            for (const value of this.enumKeys(Mode)) {
                if ("1" === "1") {
                    if (_mode.toLowerCase() === Mode[value]) {
                        return Mode[value];
                    }
                }
            }
            // return fallback
            if (fallback != null) {
                return fallback;
            }
            else {
                return Mode.PUSH;
            }
        };
        // not used
        // replacer(key, val: string) {
        //     if (typeof (val) !== "string") return val;
        //     return val
        //         .replace(/[\\]/g, '\\\\')
        //         .replace(/[\/]/g, '\\/')
        //         .replace(/[\b]/g, '\\b')
        //         .replace(/[\f]/g, '\\f')
        //         .replace(/[\n]/g, '\\n')
        //         .replace(/[\r]/g, '\\r')
        //         .replace(/[\t]/g, '\\t')
        //         .replace(/[\"]/g, '\\"')
        //         .replace(/\\'/g, "\\'");
        // }
        this.boolHandler = (bool) => {
            if (typeof bool === 'string') {
                const _bool = (bool.toLowerCase() === 'true') ? true : false;
                return _bool;
            }
            else {
                return bool;
            }
        };
        this.log = (message) => {
            if (this.consoleDisplay === true) {
                console.log(`${message}`);
            }
        };
        // if no options use, use defaults
        this.options = options || {
            io: null,
            consoleDisplay: true,
            verboseServerMessage: true,
            name: "default"
        };
        this.IO = options.io;
        this.consoleDisplay = true;
        this.Version = options.version || "0.3.0b";
        this.verboseServerMessage = true;
        this.Users = new Map();
        this.Controls = [];
        this.Events = [];
        this.Rooms = [];
        this.Name = options.name;
        this.log("Created HUB instance with name: " + this.Name);
    }
    onNewConnection(socket) {
        // executed when a new connect is made
        const snsp = socket.nsp.name;
        const _sock = socket;
        if (socket.handshake.query.username) {
            this.log('Connection has incoming query properties ' + socket.handshake.query.username);
        }
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
        //#region socket.on events
        socket.on('clearUsers', () => {
            socket.broadcast.emit('serverMessage', 'clearing user list');
            this.IO.emit('serverMessage', 'clearing user list');
            this.log("Clearing user list...");
            clearUsers();
            allUsers();
        });
        // socket.on('clearControls', () => {
        //     socket.broadcast.emit('serverMessage', 'clearing control list');
        //     this.log("Clearing control list..");
        //     clearControls();
        //     allControls();
        // });
        // socket.on('clearEvents', () => {
        //     this.IO.of(snsp).emit('serverMessage', 'clearing Events list');
        //     this.log("Clearing Events list..");
        //     this.Events = [];
        //     listEvents();
        // });
        socket.on('chat', (data) => {
            chat(data);
        });
        socket.on('addUsername', (data) => {
            addUsername(data);
        });
        socket.on('event', (data) => {
            event(data);
        });
        // going away...
        socket.on('getEvents', () => {
            allEvents();
        });
        socket.on('clearControl', (data) => {
            clearControls(data);
        });
        socket.on('clearAllControls', () => {
            clearControls();
        });
        socket.on('clearEvent', (data) => {
            clearEvents(data);
        });
        socket.on('clearAllEvents', () => {
            clearEvents();
        });
        // return a list of Users to requestor
        socket.on('getUsers', () => {
            allUsers();
        });
        // clear Users
        socket.on('clearUsers', () => {
            clearUsers();
        });
        // remove user
        socket.on('disconnect', () => {
            removeUser();
        });
        socket.on('control', (data) => {
            control(data);
        });
        socket.on('observeControl', (data) => {
            observeControl(data, observedControls);
        });
        socket.on('unobserveControl', (data) => {
            unobserveControl(data);
        });
        socket.on('unpublishControl', (data) => {
            unpublishControl(data);
        });
        socket.on('observeAllControl', (data) => {
            observeAllControl(data);
        });
        socket.on('observeEvent', (data) => {
            observeEvent(data, observedEvents);
        });
        socket.on('unobserveEvent', (data) => {
            unobserveEvent(data);
        });
        socket.on('unpublishEvent', (data) => {
            unpublishEvent(data);
        });
        socket.on('getMyControls', () => {
            myControls();
            availableControls();
            observedControls();
        });
        socket.on('getMyEvents', () => {
            myEvents();
            availableEvents();
            observedEvents();
        });
        socket.on('observeAllEvents', (data) => {
            observeAllEvents(data);
        });
        socket.on('getControl', (data) => {
            getControl(data);
        });
        socket.on('setConsoleDisplay', (boolState) => {
            setConsoleDisplay(boolState);
        });
        socket.on('allRooms', () => {
            allRooms();
        });
        socket.on('joinRoom', (data) => {
            joinRoom(data);
        });
        socket.on('leaveRoom', (room) => {
            leaveRoom(room);
        });
        socket.on('getMyRooms', () => {
            myRooms();
        });
        socket.on('getAvailableRooms', () => {
            availableRooms();
            availableRoomsList();
        });
        //#endregion
        //#region functions
        const getControl = (data) => {
            if (!data.hasOwnProperty('header')) {
                this.log('get control missing header parameter');
                sendError(`getControl missing header parameter: {header: <headername>}`);
            }
            if (data.header === 'dump') {
                allControls();
            }
            else {
                // should there be a null check for values?
                const _values = getControlValues(data.header);
                // construct control object
                const _controlObject = {
                    header: _values.header,
                    values: _values.values
                };
                socket.emit('control', _controlObject);
            }
        };
        const event = (data) => {
            this.log(`received event:  ${data.header}`);
            if (!data.hasOwnProperty('header')) {
                // error
                return;
            }
            if (!data.hasOwnProperty('mode')) {
                data.mode = "push";
            }
            ;
            data.mode = this.modeHandler(data.mode);
            // PUBLISH Event - target: subscribers
            if (data.mode === Mode.PUBLISH) {
                // check if event header already exists, if not create a new event
                let _event = this.Events.find(_e => _e.header === data.header);
                if (_event === null || _event === undefined) {
                    // new Event...
                    this.log(`adding Event... ${data.header}`);
                    const _eventObject = {
                        header: data.header,
                        from: socket.id,
                        observers: [],
                        mode: data.mode,
                        target: data.target
                    };
                    if (data.target === "all") {
                        console.log('added an event with \'all\' target');
                    }
                    // add new event to Events container
                    this.Events.push(_eventObject);
                    // send list of all events
                    _event = this.Events.find(_e => _e.header === data.header);
                    appendUserProperty('myEvents', data.header);
                    allEvents();
                    processAvailableObservedEvent();
                    _event = this.Events.find(_e => _e.header === data.header);
                }
                else {
                    // if other user is trying to use the same header: reject
                    if (_event.from !== socket.id) {
                        this.log(`Comparing ${_event.from} with socket: ${socket.id}`);
                        this.log(`Rejecting Control: Header '${_event.header} already being used by ${getUsernameFromSocketID(_event.from)}.`);
                        sendError(`Rejecting Control: Header '${_event.header} already being used by ${getUsernameFromSocketID(_event.from)}.`);
                        return;
                    }
                    // if mode changes, update
                    if (_event.mode !== data.mode) {
                        if (data.mode !== 'publish') {
                            processAvailableObservedEvent(); // to all in namespace
                        }
                        allEvents();
                    }
                    // create the outgoing event object
                    const eventObject = {
                        header: data.header,
                        from: getUsernameFromSocketID()
                    };
                    this.log(`A Publish Event Received:  ${data.header} : ${data.target}`);
                    // 1. broadcast values to individual observers
                    if (_event.observers.length > 0) {
                        broadcast(CHMessageType.EVENT, _event.observers, eventObject);
                    }
                    // 2. get socket ids of all users with observerallevents === true
                    const allEventObservers = Array.from(this.Users.values()).filter((user) => user.observeallevents === true).map((user) => user.id);
                    // 3. filter out individual observers from the observeallcontrol array (bc we've sent to them already at step (1))
                    let filteredEventObservers = allEventObservers.filter(observer => !_event.observers.includes(observer));
                    const _allclients = getConnectedSockets();
                    // filter out individuals based on target value
                    if (data.target === 'all') {
                        //  don't need this?
                    }
                    else if (this.IO.of(snsp).adapter.rooms.has(data.target)) {
                        // observers in room...
                        // all sockets in target room
                        const clientsInRoom = Array.from(this.IO.of(snsp).adapter.rooms.get(data.target));
                        // const clientsInRoom = Object.keys(socket.rooms[data.target].sockets);
                        filteredEventObservers = filteredEventObservers.filter(target => clientsInRoom.includes(target));
                    }
                    else if (_allclients.includes(getSocketIDFromUsername(data.mode))) {
                        // individual observer
                        filteredEventObservers = filteredEventObservers.filter(target => target === data.target);
                    }
                    this.log('Targeted Observers: ' + filteredEventObservers);
                    // 4. broadcast to (remaining) filteredControlObservers
                    if (filteredEventObservers.length > 0) {
                        broadcast(CHMessageType.EVENT, filteredEventObservers, eventObject);
                        return;
                    }
                }
            }
            // PUSH events - PUSH events are sent all in the namespace
            if (data.mode === Mode.PUSH) {
                const eventObject = {
                    header: data.header,
                    from: getUsernameFromSocketID()
                };
                if (data.target === 'all') {
                    const allSockets = getConnectedSockets();
                    broadcast(CHMessageType.EVENT, allSockets, eventObject);
                    return;
                }
                // check if target is a room
                if (this.Rooms.includes(data.target)) {
                    this.log(`Sending Event ${data.header} to Room  ${data.target}`);
                    this.IO.of(snsp).to(data.target).emit('event', eventObject);
                    return;
                }
                // check if target is a user
                const targetuser = getSocketIDFromUsername(data.target);
                if (targetuser !== null) {
                    this.log(`Sending event ${data.header} to target user ${targetuser}`);
                    broadcast(CHMessageType.EVENT, targetuser, eventObject);
                }
                // default event error
                else {
                    // error
                }
            }
        };
        const control = (data) => {
            const testData = new Object(data);
            if (!this.isCHControlToServer(testData)) {
                console.warn(`Control object is missing but will add 'property' with an 'all' value.`);
                data.target = 'all';
                control(data);
            }
            this.log("control: " + data.header + " - " + data.values + " mode: " + data.mode);
            if (data.header === null || data.header === undefined) {
                this.log(`Control data without header. Sender: ${getUsernameFromSocketID(socket.id)} - ${socket.id}`);
                return;
            }
            if (data.mode === null || data.mode === undefined) {
                this.log(`Control data without mode: ${getUsernameFromSocketID(socket.id)} - ${socket.id}`);
                return;
            }
            data.mode = this.modeHandler(data.mode);
            // PUBLISH -- UNIQUE HEADERS IMPLEMENTED
            if (data.mode === Mode.PUBLISH) {
                // check if control header already exists
                let _control = this.Controls.find(c => c.header === data.header);
                // if control does not exist
                if (_control === null || _control === undefined) {
                    // create new control obj
                    this.log(`Adding new Control... ${data} : sid ${socket.id}`);
                    const _controlObject = {
                        header: data.header,
                        values: data.values,
                        from: socket.id,
                        observers: [],
                        mode: data.mode,
                        target: data.target
                    };
                    // add new control to Controls container for mode PUBLISH
                    this.Controls.push(_controlObject);
                    appendUserProperty('myControls', data.header);
                    allControls(); // to all in namespace
                    processAvailableObservedControl(); // to all in namespace
                    _control = this.Controls.find(c => c.header === data.header);
                }
                else {
                    // if other user is trying to use the same header: reject
                    if (_control.from !== socket.id) {
                        this.log(`Comparing ${_control.from} with socket: ${socket.id}`);
                        this.log(`Rejecting Control: Header '${_control.header} already being used by ${getUsernameFromSocketID(_control.from)}.`);
                        sendError(`Rejecting Control: Header '${_control.header} already being used by ${getUsernameFromSocketID(_control.from)}.`);
                        return;
                    }
                    // if the mode changes, update
                    if (_control.mode !== data.mode) {
                        if (data.mode !== 'publish') {
                            processAvailableObservedControl(); // to all in namespace
                        }
                        allControls();
                    }
                    // update values to existing control object
                    _control.values = data.values;
                    _control.from = socket.id;
                    _control.mode = data.mode;
                    processAvailableObservedControl(); // to all in namespace
                }
                // form the outgoing control object
                const controlObject = {
                    header: data.header,
                    values: data.values,
                    from: getUsernameFromSocketID(socket.id)
                };
                // this.log('publish control');
                // 1. broadcast values to individual observers
                if (_control.observers.length > 0) {
                    //
                    broadcast(CHMessageType.CONTROL, _control.observers, controlObject);
                }
                // 2. Get socket ids of all users with observeallcontrols === true
                const allControlObservers = Array.from(this.Users.values()).filter((user) => user.observeallcontrol === true).map((user) => user.id);
                // 3. filter out individual observers from the observeallcontrol array
                let filteredControlObservers = allControlObservers.filter(observer => !_control.observers.includes(observer));
                const _allclients = getConnectedSockets();
                // TARGET
                if (data.target === 'all') {
                    //
                }
                else if (this.IO.of(snsp).adapter.rooms.get(data.target)) {
                    // observers in room...
                    // all sockets in a target room
                    const clientsInRoom = Array.from(this.IO.of(snsp).adapter.rooms.get(data.target));
                    // const clientsInRoom = Object.keys(socket.rooms[data.target].sockets);
                    filteredControlObservers = filteredControlObservers.filter(target => clientsInRoom.includes(target));
                }
                else if (_allclients.includes(getSocketIDFromUsername(data.mode))) {
                    // individual observer
                    filteredControlObservers = filteredControlObservers.filter(target => target === data.target);
                }
                // broadcast to filteredControlObservers
                if (filteredControlObservers.length > 0) {
                    broadcast(CHMessageType.CONTROL, filteredControlObservers, controlObject);
                }
                this.log('Targeted Observers: ' + filteredControlObservers);
                this.log('New Public Control Data: ' + data.header + " - " + data.values + " - from: " + getUsernameFromSocketID());
            }
            if (data.mode === Mode.PUSH) {
                // form the outgoing control object
                const controlObject = {
                    header: data.header,
                    values: data.values,
                    from: getUsernameFromSocketID(socket.id)
                };
                if (data.target === 'all') {
                    const allSockets = getConnectedSockets();
                    broadcast(CHMessageType.CONTROL, allSockets, controlObject);
                }
                if (this.Rooms.includes(data.target)) {
                    this.log('Control data to room: ' + data.target);
                    this.IO.of(snsp).to(data.target).emit('control', controlObject);
                    return;
                }
                const targetuser = getSocketIDFromUsername(data.target);
                if (targetuser !== null) {
                    this.log('sending control to user');
                    broadcast(CHMessageType.CONTROL, targetuser, controlObject);
                }
                // default event error
                else {
                    // error
                }
            }
        };
        const chat = (data) => {
            if (!data.hasOwnProperty('chat')) {
                //
                this.log(`Chat message missing 'chat' property`);
                sendError(`Chat message missing 'chat' property`);
                return;
            }
            if (!data.hasOwnProperty('target')) {
                //
                this.log(`Chat message missing 'chat' property`);
                sendError(`Chat message missing 'target' property`);
                return;
            }
            // create the outgoing object, with username from id
            const _chatObject = {
                id: getUsernameFromSocketID(),
                chat: data.chat
            };
            if (data.target === undefined) {
                data.target = 'all';
            }
            if (data.target.toLowerCase() === 'all') {
                data.target = data.target.toLowerCase();
            }
            if (data.target === 'all') {
                // let allSockets = getConnectedSockets();
                // sending to all clients in namespace, including sender
                this.IO.of(snsp).emit('chat', _chatObject);
                return;
            }
            // check if target is a room or a target...
            if (this.Rooms.includes(data.target)) {
                this.log('chatting to room: ' + data.target);
                this.IO.of(snsp).to(data.target).emit('chat', _chatObject);
                return;
            }
            // send to target user
            const targetuser = getSocketIDFromUsername(data.target);
            if (targetuser !== null) {
                this.log(`chatting to user:  ${_chatObject.chat} + ${data.target}: ${targetuser}`);
                broadcast(CHMessageType.CHAT, targetuser, _chatObject);
            }
            else {
                sendServerMessage("Chat with a username target did not work -- please check username construction.");
            }
            // this.log(`chat message received and broadcast ${tempid}`);
        };
        // general broadcast function (one or multiple targets)
        const broadcast = (type, targets, dataObject) => {
            switch (type) {
                case CHMessageType.CONTROL:
                    if (Array.isArray(targets)) {
                        for (const target of targets) {
                            socket.to(target).emit(type, dataObject);
                            this.log(`Broadcasting Control Values`);
                        }
                    }
                    else {
                        socket.to(targets).emit(type, dataObject);
                    }
                    break;
                case CHMessageType.EVENT:
                    if (Array.isArray(targets)) {
                        for (const target of targets) {
                            socket.to(target).emit(type, dataObject);
                            this.log(`emitting ${type} to ${target}`);
                        }
                    }
                    else {
                        socket.to(targets).emit(type, dataObject);
                        this.log(`emitting ${type} to ${targets}`);
                    }
                    break;
                case CHMessageType.CHAT:
                    // targets an array of socketids
                    if (typeof targets === 'string') {
                        socket.to(targets).emit(type, dataObject);
                        return;
                    }
                    for (const target of targets) {
                        socket.to(target).emit(type, dataObject);
                        if (this.consoleDisplay === true) {
                            this.log(`emitting ${type} to ${target}`);
                        }
                    }
                    break;
                case CHMessageType.MESSAGE:
                    // check if has many recipients
                    if (Array.isArray(targets)) {
                        if (this.consoleDisplay === true) {
                            this.log(`${Array.isArray(targets)}`);
                        }
                        // targets an array of socketids
                        for (const target of targets) {
                            // socket.to(target).emit(type, header, message);
                            // if (this.consoleDisplay === true) {
                            //     this.log(`Emitting ${type} - ${message} to ${target}`);
                            // }
                        }
                    }
                    else {
                        // testing some things here, not real implementation
                        for (const room in socket.rooms) {
                            if (Object.keys(socket.rooms[room]) != null) {
                                const tempSockets = Object.keys(socket.rooms[room].sockets);
                                tempSockets.forEach(tempSocket => {
                                    const _message = {
                                        message: 'hello friends!'
                                    };
                                    socket.to(tempSocket).emit('serverMessage', _message);
                                });
                            }
                        }
                        if (this.consoleDisplay === true) {
                            this.log(targets);
                            // this.IO.of(snsp).emit('serverMessage', 'hello solo friends!');
                        }
                    }
                    break;
                case CHMessageType.LIST:
                    // LISTS MUST SEND TO EVERYONE
                    for (const target of targets) {
                        // socket.to(target).emit(header, message);
                        if (this.consoleDisplay === true) {
                            this.log(`emitting ${type} to ${target}`);
                        }
                    }
                    break;
            }
        };
        const getConnectedSockets = () => {
            return Array.from(this.Users.keys());
        };
        const sendServerMessage = (message) => {
            if (!this.verboseServerMessage)
                return;
            const _message = {
                message
            };
            socket.emit('serverMessage', _message);
        };
        const addUsername = (data) => {
            // error
            if (!data.hasOwnProperty('username')) {
                this.log("unable to change username - property missing");
                sendServerMessage("Unable to change username -- username property missing");
                return;
            }
            this.log("changing user name");
            const newUsername = data.username;
            // check if username already exists
            for (const [_id, values] of this.Users.entries()) {
                if (values.username === newUsername) {
                    this.log("Username already exists. Username change rejected.");
                    sendServerMessage('Username already exists. Please select a different username.');
                    return;
                }
            }
            // find existing user, add new username
            if (this.Users.has(socket.id)) {
                changeUserProperty('username', newUsername);
            }
            else {
                // this should not happen, normally
                addUser(socket);
                addUsername(newUsername);
            }
            // server feedback and upload other users
            this.log("Updated username " + newUsername + " for socket " + socket.id);
            myUsername();
            allUsers();
            allControls();
            allEvents();
            updateRooms();
        };
        const myUsername = (whichSocket) => {
            if (whichSocket === undefined) {
                whichSocket = socket.id;
            }
            if (this.Users.has(whichSocket)) {
                const usernameObj = {
                    username: this.Users.get(whichSocket).username
                };
                this.IO.of(snsp).to(whichSocket).emit('myUsername', usernameObj);
            }
            else {
                console.warn(`what username? for ${whichSocket}`);
            }
        };
        // utility
        const changeUserProperty = (property, value) => {
            // users properties: id, username, observeallcontrol, observeallevents
            if (this.Users.has(socket.id)) {
                const _userObject = this.Users.get(socket.id);
                _userObject[property] = value;
                this.Users.set(socket.id, _userObject);
            }
        };
        // utility
        const appendUserProperty = (property, value) => {
            // users properties: id, username, observeallcontrol, observeallevents
            if (this.Users.has(socket.id)) {
                const _userObject = this.Users.get(socket.id);
                const props = ["observingEvent", "observingControl", "myControls", "myEvents"];
                if (props.includes(property)) {
                    if (_userObject[property].includes(value)) {
                        this.log(`Attempting to append non-appendable property in UserDetails: ${property} -- Already exists in property`);
                        return;
                    }
                    _userObject[property].push(value);
                    this.log(`---- Appended ${value} to ${property}`);
                    this.Users.set(socket.id, _userObject);
                }
                else {
                    this.log(`Attempting to append non-appendable property in UserDetails: ${property}`);
                }
            }
        };
        // utility
        const removeUserProperty = (property, value) => {
            // users properties: id, username, observeallcontrol, observeallevents
            if (this.Users.has(socket.id)) {
                const _userObject = this.Users.get(socket.id);
                if (_userObject[property] !== undefined) {
                    _userObject[property] = _userObject[property].filter(item => item !== value);
                }
                this.Users.set(socket.id, _userObject);
            }
        };
        // could eliminate this function and have the socket.on event all the changeUserProperty function
        const observeAllControl = (data) => {
            if (data.hasOwnProperty('observe')) {
                if (typeof data.observe === "string") {
                    data.observe = data.observe.toLowerCase();
                    data.observe = (data.observe === 'true' ? true : false);
                }
                if (data.observe === 1 || data.observe === "1") {
                    data.observe = true;
                }
                if (data.observe === 0 || data.observe === "0") {
                    data.observe = false;
                }
                changeUserProperty('observeallcontrol', data.observe);
                this.log(`Observing all control ${data.observe} for ${getUsernameFromSocketID()}`);
            }
            else {
                // error
                this.log("observall control missing 'observe' property");
            }
        };
        // could eliminate this function and have the socket.on event all the changeUserProperty function
        const observeAllEvents = (data) => {
            if (data.hasOwnProperty('observe')) {
                if (typeof data.observe === "string") {
                    data.observe = data.observe.toLowerCase();
                    data.observe = (data.observe === 'true' ? true : false);
                }
                if (data.observe === 1) {
                    data.observe = true;
                }
                if (data.observe === 0) {
                    data.observe = false;
                }
                changeUserProperty('observeallevents', data.observe);
                this.log(`Observing all events ${data.observe} for ${getUsernameFromSocketID()}`);
            }
            else {
                // error
                this.log("observall events missing 'observe' property");
            }
        };
        const observeControl = (data, callback) => {
            if (!data.hasOwnProperty('header')) {
                // error
                this.log(`${getUsernameFromSocketID()} attempting to observe control that doesn't exit: ${data.header}`);
                sendServerMessage(`${getUsernameFromSocketID()} attempting to observe control that doesn't exit: ${data.header}`);
            }
            else {
                this.log(`${getUsernameFromSocketID()} observing : ${data.header}`);
                const header = data.header;
                const foundControl = this.Controls.filter(target => target.header === data.header);
                // check if control header exists, if no, through warning
                if (foundControl.length > 0) {
                    // add socket id to array of control's observers
                    if (!foundControl[0].observers.includes(socket.id)) {
                        appendUserProperty('observingControl', header);
                        foundControl[0].observers.push(socket.id);
                        this.log(`Added control observer: ${getUsernameFromSocketID()} to ${foundControl[0].header}`);
                        // console.table(foundControl);
                        allControls();
                        myControls();
                        availableControls();
                    }
                    else {
                        this.log(`${getUsernameFromSocketID()} already a subscriber to ${data.header}.`);
                        // broadcast(CHMessageType.FROMSERVER, socket.id, 'serverMessage', `Control header ${data.header} not found`);
                    }
                }
                else {
                    this.log(`Control header ${data.header} does not exist : ${foundControl}`);
                    // broadcast(CHMessageType.FROMSERVER, socket.id, 'serverMessage', `Control header ${data.header} not found`);
                }
            }
            callback();
        };
        const unobserveControl = (data) => {
            if (typeof data !== 'object') {
                // error
                console.warn("not object");
                return;
            }
            if (data.header === undefined) {
                // error
                console.warn("no header");
                return;
            }
            const header = data.header;
            // check if control header already exists,
            const found = this.Controls.find(target => target.header === header);
            if (found === null || found === undefined) {
                // err out, control header not found
                this.log(`Attempting to unobserve control with header: ${header}. Control does not exist`);
                sendServerMessage(`Attempting to unobserve control with header: ${header}. Control does not exist`);
                return;
            }
            if (!found.hasOwnProperty('observers')) {
                this.log(`Attempting to unobserve to header: ${header}. Header not found.`);
                return;
            }
            if (found.observers.includes(socket.id)) {
                // remove observer
                found.observers.splice(found.observers.indexOf(socket.id), 1);
                removeUserProperty('observingControl', data.header);
                // recreate array if necessary
                if (found.observers === null || typeof found.observers === undefined) {
                    found.observers = [];
                }
                this.log(`${getUsernameFromSocketID} succcessfully unobserved from ${data.header}`);
                allControls();
                myControls();
                observedControls();
                availableControls();
            }
            else {
                // observer not found
                this.log('observer not found');
            }
        };
        const observeEvent = (data, callback) => {
            if (!data.hasOwnProperty('header')) {
                this.log("observe event request is missing header property");
                return;
            }
            const header = data.header;
            this.log(getUsernameFromSocketID() + ' observing event ' + header);
            const foundEvent = this.Events.filter(target => target.header === header);
            // check if control header exists, if no, through warning
            if (foundEvent.length > 0) {
                // add socket id to array of control's observers
                if (!foundEvent[0].observers.includes(socket.id)) {
                    appendUserProperty('observingEvent', header);
                    foundEvent[0].observers.push(socket.id);
                    this.log('added event observer-- ' + foundEvent[0].observers);
                    allEvents();
                    myEvents();
                    availableEvents();
                }
                else {
                    this.log(`${getUsernameFromSocketID()} already an observer of event ${header}.`);
                }
            }
            else {
                if (this.consoleDisplay === true) {
                    this.log(`Event header ${header} does not exist`);
                }
            }
            callback();
        };
        const myEvents = (whichSocket) => {
            if (whichSocket === undefined) {
                whichSocket = socket.id;
            }
            const tempUsers = _.cloneDeep(this.Users);
            if (!tempUsers.has(whichSocket)) {
                return [];
            }
            const tempEvents = _.cloneDeep(this.Events);
            const _myEvents = tempUsers.get(whichSocket).myEvents;
            const foundEvents = tempEvents.filter(target => _myEvents.includes(target.header));
            for (const _event in foundEvents) {
                if (foundEvents[_event] != null) {
                    foundEvents[_event].observers = foundEvents[_event].observers.map(_observer => getUsernameFromSocketID(_observer));
                    foundEvents[_event].from = getUsernameFromSocketID(foundEvents[_event].from);
                }
            }
            const obj = {
                events: foundEvents
            };
            this.IO.of(snsp).to(whichSocket).emit('myEvents', obj);
            return foundEvents;
        };
        const myControls = (whichSocket) => {
            if (whichSocket === undefined) {
                whichSocket = socket.id;
            }
            const tempUsers = _.cloneDeep(this.Users);
            if (!tempUsers.has(whichSocket)) {
                return [];
            }
            const tempControls = _.cloneDeep(this.Controls);
            const _myControls = tempUsers.get(whichSocket).myControls;
            const foundControls = tempControls.filter(target => _myControls.includes(target.header));
            for (const _control in foundControls) {
                if (foundControls[_control] != null) {
                    foundControls[_control].observers = foundControls[_control].observers.map(_observer => getUsernameFromSocketID(_observer));
                    foundControls[_control].from = getUsernameFromSocketID(foundControls[_control].from);
                }
            }
            const obj = {
                controls: foundControls,
            };
            this.IO.of(snsp).to(whichSocket).emit('myControls', obj);
            return foundControls;
        };
        const unpublishControl = (data, callback) => {
            if (!data.hasOwnProperty('header')) {
                // error
                this.log(`unpublishControl is missing header key.`);
                sendServerMessage(`unpublishControl is missing header key.`);
                return;
            }
            const controlsList = this.Controls.map(_control => _control.header);
            // using filter bc slice shallow copies
            if (controlsList.includes(data.header)) {
                this.Controls = this.Controls.filter(_control => _control.header !== data.header);
                this.log(`Unpublished Control with header: ${data.header}.`);
                return;
            }
            else {
                this.log(`Attempting to unpublish a non-existent header.`);
            }
            callback();
        };
        const allControls = () => {
            // emits to all in namespace
            const foundControls = _.cloneDeep(this.Controls);
            for (const _control in foundControls) {
                if (foundControls[_control] != null) {
                    foundControls[_control].observers = foundControls[_control].observers.map(_observer => getUsernameFromSocketID(_observer));
                    foundControls[_control].from = getUsernameFromSocketID(foundControls[_control].from);
                }
            }
            const obj = {
                controls: foundControls,
            };
            this.IO.of(snsp).emit('allControls', obj);
            return foundControls;
        };
        const allEvents = () => {
            // emits to all in namespace
            const foundEvents = _.cloneDeep(this.Events);
            for (const _event in foundEvents) {
                if (foundEvents[_event] != null) {
                    foundEvents[_event].observers = foundEvents[_event].observers.map(_observer => getUsernameFromSocketID(_observer));
                    foundEvents[_event].from = getUsernameFromSocketID(foundEvents[_event].from);
                }
            }
            const obj = {
                events: foundEvents,
            };
            this.IO.of(snsp).emit('allEvents', obj);
            return foundEvents;
        };
        // const dumpControls = () => {
        //     this.log("dumping all control data ");
        //     // create a human readable verison of controls -- replace all socket ids with usernames
        //     const controls: CHControl[] = _.cloneDeep(this.Controls);
        //     for (const _control in controls) {
        //         if (controls[_control] != null) {
        //             controls[_control].observers = controls[_control].observers.map(_observer => getUsernameFromSocketID(_observer));
        //             controls[_control].from = getUsernameFromSocketID(controls[_control].from);
        //         }
        //     }
        //     // convert array to object
        //     const controlsObject: CHControlsToClient = {
        //         controls
        //     }
        //     this.IO.of(snsp).emit('controlDump', controlsObject);
        // }
        const observedControls = (whichSocket) => {
            this.log('listing observed controls');
            if (whichSocket === undefined) {
                whichSocket = socket.id;
            }
            const tempControls = _.cloneDeep(this.Controls);
            const foundControls = tempControls.filter(target => target.observers.includes(whichSocket));
            for (const _control in foundControls) {
                if (foundControls[_control] != null) {
                    foundControls[_control].observers = foundControls[_control].observers.map(_observer => getUsernameFromSocketID(_observer));
                    foundControls[_control].from = getUsernameFromSocketID(foundControls[_control].from);
                }
            }
            const obj = {
                controls: foundControls,
            };
            this.log("observed Controls: " + foundControls);
            this.IO.of(snsp).to(whichSocket).emit('observedControls', obj);
            return foundControls;
        };
        const observedEvents = (whichSocket) => {
            this.log('listing observed events');
            if (whichSocket === undefined) {
                whichSocket = socket.id;
            }
            const tempEvents = _.cloneDeep(this.Events);
            const foundEvents = tempEvents.filter(target => target.observers.includes(whichSocket));
            for (const _event in foundEvents) {
                if (foundEvents[_event] != null) {
                    foundEvents[_event].observers = foundEvents[_event].observers.map(_observer => getUsernameFromSocketID(_observer));
                    foundEvents[_event].from = getUsernameFromSocketID(foundEvents[_event].from);
                }
            }
            const obj = {
                events: foundEvents,
            };
            this.log("observed Events: " + foundEvents);
            this.IO.of(snsp).to(whichSocket).emit('observedEvents', obj);
            return foundEvents;
        };
        const unpublishEvent = (data, callback) => {
            if (!data.hasOwnProperty('header')) {
                // error
                this.log(`unpublishEvent is missing header key.`);
                sendServerMessage(`unpublishEvent is missing header key.`);
                return;
            }
            const eventsList = this.Events.map(_event => _event.header);
            // using filter bc slice shallow copies
            if (eventsList.includes(data.header)) {
                this.Events = this.Events.filter(_event => _event.header !== data.header);
                this.log(`Unpublished Event with header: ${data.header}.`);
                return;
            }
            else {
                this.log(`Attempting to unpublish event with non-existent header.`);
            }
            callback();
        };
        const listMyControlsDetails = (whichSocket) => {
            if (whichSocket === undefined) {
                whichSocket = socket.id;
            }
            const foundControls = this.Controls.filter(target => target.observers.includes(whichSocket));
            const obj = {
                controls: foundControls,
            };
            this.IO.of(snsp).to(whichSocket).emit('myControlsDetails', obj);
            return foundControls;
        };
        const availableControls = (whichSocket) => {
            if (whichSocket == null) {
                whichSocket = socket.id;
            }
            const tempControls = _.cloneDeep(this.Controls);
            // get controls with target 'all'
            const foundAllControls = tempControls.filter(fe => fe.target === 'all');
            // get roomnames of each client/user
            const tempRooms = getRoomnamesFromSocketID(whichSocket);
            // get controls with target roomnames that client is in
            const foundAllRoomControls = tempControls.filter(fr => tempRooms.includes(fr.target));
            // concatentate rooms, remove dupes, and alpha sort
            let foundControls = foundAllControls.concat(foundAllRoomControls);
            foundControls = [...new Set(foundControls)].sort();
            // remove socket's own controls
            const myControlHeaders = myControls(whichSocket).map(_control => _control.header);
            foundControls = foundControls.filter(_control => !myControlHeaders.includes(_control.header));
            // remove any controls that user is already observing
            const clientControlsObservings = this.Users.get(whichSocket).observingControl;
            if (clientControlsObservings.length > 0)
                foundControls = foundControls.filter(fr => !clientControlsObservings.includes(fr.header));
            for (const _control in foundControls) {
                if (foundControls[_control] != null) {
                    foundControls[_control].observers = foundControls[_control].observers.map(_observer => getUsernameFromSocketID(_observer));
                    foundControls[_control].from = getUsernameFromSocketID(foundControls[_control].from);
                }
            }
            const obj = {
                controls: foundControls
            };
            this.IO.of(snsp).to(whichSocket).emit('availableControls', obj);
            return foundControls;
        };
        const processAvailableObservedControl = () => {
            this.Users.forEach(user => {
                availableControls(user.id);
                observedControls(user.id);
            });
        };
        const processAvailableObservedEvent = () => {
            this.Users.forEach(user => {
                availableEvents(user.id);
                observedEvents(user.id);
            });
        };
        const availableEvents = (whichSocket) => {
            if (whichSocket == null) {
                whichSocket = socket.id;
            }
            const tempEvents = _.cloneDeep(this.Events);
            // get controls with target 'all'
            const foundAllEvents = tempEvents.filter(fe => fe.target === 'all');
            // get roomnames of each client/user
            const tempRooms = getRoomnamesFromSocketID(whichSocket);
            // get controls with target roomnames that client is in
            const foundAllRoomEvents = tempEvents.filter(fr => tempRooms.includes(fr.target));
            // concatentate rooms, remove dupes, and alpha sort
            let foundEvents = foundAllEvents.concat(foundAllRoomEvents);
            foundEvents = [...new Set(foundEvents)].sort();
            // remove socket's own events
            const myEventsHeaders = myEvents(whichSocket).map(_event => _event.header);
            foundEvents = foundEvents.filter(_event => !myEventsHeaders.includes(_event.header));
            // remove any controls that user is already observing
            const clientEventsObservings = this.Users.get(whichSocket).observingEvent;
            if (clientEventsObservings.length > 0)
                foundEvents = foundEvents.filter(fr => !clientEventsObservings.includes(fr.header));
            for (const _event in foundEvents) {
                if (foundEvents[_event] != null) {
                    foundEvents[_event].observers = foundEvents[_event].observers.map(_observer => getUsernameFromSocketID(_observer));
                    foundEvents[_event].from = getUsernameFromSocketID(foundEvents[_event].from);
                }
            }
            const obj = {
                events: foundEvents
            };
            this.IO.of(snsp).to(whichSocket).emit('availableEvents', obj);
            return foundEvents;
        };
        const unobserveEvent = (data) => {
            if (!data.hasOwnProperty('header')) {
                // error
                this.log("Unobserve has empty header.");
                sendServerMessage(`unobserveEvent is missing header parameter.`);
            }
            if (data.header === "") {
                // error
                this.log("Unobserve has empty header");
                sendServerMessage(`unobserveEvent is header is empty/blank.`);
                return;
            }
            // check if event header already exists,
            const _foundEvent = this.Events.filter(target => target.header === data.header);
            if (_foundEvent === null || _foundEvent === undefined) {
                // err out, event header not found
                this.log(`Event ${data.header} not found.`);
                return;
            }
            if (_foundEvent[0] === null || _foundEvent[0] === undefined) {
                this.log(`Event ${data.header} not found.`);
                return;
            }
            if ('observers' in _foundEvent[0] === false) {
                this.log('no observers property' + _foundEvent);
                return;
            }
            else {
                if (_foundEvent[0].observers.includes(socket.id)) {
                    // remove observer
                    _foundEvent[0].observers.splice(_foundEvent[0].observers.indexOf(socket.id), 1);
                    removeUserProperty('observingEvent', data.header);
                    this.log('removing observer ' + getUsernameFromSocketID() + ' from event');
                    // recreate array if necessary
                    if (_foundEvent[0].observers === null || typeof _foundEvent[0].observers === undefined) {
                        _foundEvent[0].observers = [];
                    }
                    allEvents();
                    myEvents();
                    observedEvents();
                    availableEvents();
                }
                else {
                    // observer not found
                    this.log('event observer not found');
                }
            }
        };
        const clearEvents = (data) => {
            // remove a group of events
            if (Array.isArray(data.header)) {
                this.Events = this.Events.filter(_e => !data.header.includes(_e.header));
                return;
            }
            if (data !== null || data !== undefined) {
                // remove event from header
                this.Events = this.Events.filter(_e => _e.header !== data.header);
            }
            else {
                // remove all socket / client events
                this.Events = this.Events.filter(_e => _e.from !== socket.id);
            }
        };
        const getSocketIDFromUsername = (username) => {
            for (const [_id, values] of this.Users.entries()) {
                if (values.username === username) {
                    return values.id;
                }
            }
            return null;
        };
        const getRoomnamesFromSocketID = (socketid) => {
            if (!this.IO.of(snsp).adapter.sids.has(socketid)) {
                this.log(`Adapter.sids error for ${socketid}`);
                return [];
            }
            else {
                let tempRooms = Array.from(this.IO.of(snsp).adapter.sids.get(socketid));
                tempRooms = tempRooms.filter(room => room !== socketid);
                return tempRooms;
            }
        };
        const getUsernameFromSocketID = (socketid) => {
            if (socketid === null || socketid === undefined) {
                socketid = socket.id;
            }
            // this.log(`getting username from ${socketid}`);
            if (!this.Users.has(socketid)) {
                this.log("SERIOUS ERROR!! --- unable to find username for connect id " + socketid);
                console.dir(this.Users);
                return null;
            }
            else if (this.Users.get(socketid) === undefined || this.Users.get(socketid) === null) {
                this.log(`User name for ${this.Users.get(socketid)} is undefined -- ${socketid}`);
                return null;
            }
            else {
                return this.Users.get(socketid).username;
            }
        };
        // Clear users in namespace
        const clearUsers = () => {
            this.Users.clear();
            return this;
        };
        const clearControls = (data) => {
            if (Array.isArray(data.header)) {
                this.Controls = this.Controls.filter(_control => !data.header.includes(_control.header));
                return;
            }
            if (data !== null || data !== undefined) {
                // remove event from header
                this.Controls = this.Controls.filter(_control => _control.header !== data.header);
            }
            else {
                // remove all socket / client events
                this.Controls = this.Controls.filter(_control => _control.from !== socket.id);
            }
        };
        // const clearControls = () => {
        //     this.Controls = [];
        //     return this;
        // }
        const generateRandomUsername = () => {
            const value = Math.floor(Math.random() * this.Users.size * 10);
            // var value = this.Users.size+2;
            const tempUsername = `User` + value.toString().padStart(3, "0");
            // this.log("Generating generic username: " + tempUsername);
            return tempUsername;
        };
        const generateUsername = () => {
            let tempUsername = generateRandomUsername();
            for (const [_id, values] of this.Users.entries()) {
                if (values.username === tempUsername) {
                    this.log("Username already exists");
                    tempUsername = generateUsername();
                    break;
                }
            }
            return tempUsername;
        };
        const addUser = (_socket) => {
            this.log(snsp + ": -------- Adding user ");
            // create a new user mapping
            if (!this.Users.has(_socket.id)) {
                let tempUsername = generateUsername();
                if (_socket.handshake.query.username) {
                    this.log('replacing username with ' + _socket.handshake.query.username);
                    tempUsername = _socket.handshake.query.username;
                }
                else {
                    // default behavior
                    // this.log('Unable to use query.username Check Query construction.');
                    // sendServerMessage("Error: Unable to use query.username Check Query construction.");
                }
                const _tempUserDetails = {
                    username: tempUsername,
                    id: _socket.id,
                    myControls: [],
                    myEvents: [],
                    observingEvent: [],
                    observingControl: [],
                    observeallcontrol: false,
                    observeallevents: false
                };
                this.Users.set(_socket.id, _tempUserDetails);
            }
            allUsers();
        };
        const removeUser = () => {
            this.log(`A user disconnected: ${socket.id} - ${getUsernameFromSocketID(socket.id)}`);
            // (1) remove controls from observing Users observingControl property
            const disconnectedUsersControls = this.Controls.filter(_control => _control.from === socket.id).map(_control => _control.header);
            const disconnectedUsersEvents = this.Events.filter(_event => _event.from === socket.id).map(_event => _event.header);
            // (2) find control header within Users observingControl and remove header
            for (const [user, details] of this.Users.entries()) {
                if (!this.Users.has(user)) {
                    continue;
                }
                else {
                    this.Users.get(user).observingControl = this.Users.get(user).observingControl.filter(_control => !disconnectedUsersControls.includes(_control));
                    this.Users.get(user).observingEvent = this.Users.get(user).observingEvent.filter(_event => !disconnectedUsersEvents.includes(_event));
                }
            }
            this.Users.delete(socket.id);
            // remove controls and events associated with disconnected user
            this.Controls = this.Controls.filter(_control => _control.from !== socket.id);
            this.Events = this.Events.filter(_event => _event.from !== socket.id);
            // broadcast updated user list
            allUsers();
            allEvents();
            allControls();
            allRooms();
            processAvailableObservedControl();
            processAvailableObservedEvent();
        };
        // not used
        // broadcast the list of possible events -- showing who is originator of event and who are subscribing
        const listControls = () => {
            // create a human readable version of events
            // clone so we are not changing the 'deep' values
            let _controls = _.cloneDeep(this.Controls);
            for (const _control in _controls) {
                // replace socketids with usernames
                if (_controls[_control] != null) {
                    _controls[_control].observers = _controls[_control].observers.map(observer => getUsernameFromSocketID(observer));
                    _controls[_control].from = getUsernameFromSocketID(_controls[_control].from);
                }
            }
            _controls = _controls.sort();
            const _controlsArrayObject = {
                controls: _controls
            };
            this.IO.of(snsp).emit('controls', _controlsArrayObject);
        };
        // not used
        // broadcast the list of possible events -- showing who is originator of event and who are subscribing
        const listEvents = () => {
            // clone so we are not changing the 'deep' values
            let _events = _.cloneDeep(this.Events);
            for (const _event in _events) {
                // replace socketids with usernames
                if (_events[_event] != null) {
                    _events[_event].observers = _events[_event].observers.map(observer => getUsernameFromSocketID(observer));
                    _events[_event].from = getUsernameFromSocketID(_events[_event].from);
                }
            }
            _events = _events.sort();
            const _eventsArrayObject = {
                events: _events
            };
            this.IO.of(snsp).emit('events', _eventsArrayObject);
        };
        const allUsers = () => {
            // console.table(this.Users);
            const allUserDetails = this.Users;
            // console.table(allUserDetails);
            const allUserDetailsObject = {
                users: allUserDetails
            };
            // all users with usernames as array
            const _allUsers = getConnectedSockets().map(_socket => getUsernameFromSocketID(_socket));
            const allUsersObject = {
                users: _allUsers
            };
            this.log('All users: ' + _allUsers);
            this.IO.of(snsp).emit('allUserDetails', allUserDetailsObject);
            this.IO.of(snsp).emit('allUsers', allUsersObject);
            getConnectedSockets().forEach(_socket => {
                // other users with usernames as array
                const otherUsers = getConnectedSockets().filter(user => user !== _socket)
                    .map(s => getUsernameFromSocketID(s));
                const otherUsersObject = {
                    users: otherUsers
                };
                // remove socket from collection
                const otherUserDetails = new Map(allUserDetails);
                otherUserDetails.delete(_socket);
                const otherUserDetailsObject = {
                    users: otherUserDetails
                };
                this.IO.of(snsp).to(_socket).emit('otherUsers', otherUsersObject);
                this.IO.of(snsp).to(_socket).emit('otherUserDetails', otherUserDetailsObject);
            });
        };
        const setConsoleDisplay = (val) => {
            this.consoleDisplay = val;
            this.log(`changed console display to ${this.consoleDisplay}`);
        };
        const getControlValues = (header) => {
            for (const _control of this.Controls) {
                this.log(_control.header);
                if (_control.header === header) {
                    return _control;
                }
            }
            this.log("No such control values: " + header);
            return null;
        };
        const joinRoom = (data) => {
            if (data.room === undefined) {
                // error
                this.log(`Error: No room param- ${data.room}`);
                sendServerMessage(`No room param- ${data.room}`);
                return;
            }
            if (data.room === "") {
                sendServerMessage(`joinRoom room paramter was empty/blank.`);
                this.log(`joinRoom room parameter is empty/blank.`);
                return;
            }
            // check if room is available
            if (!this.Rooms.includes(data.room.toString())) {
                this.Rooms.push(data.room.toString());
                this.log(`Created new room: ${data.room}`);
            }
            // join new room, received as function parameter
            socket.join(data.room.toString());
            sendServerMessage(socket.id + ' socket has joined into' + data.room);
            console.log(socket.id + ' socket has joined into' + data.room);
            updateRooms();
            availableEvents();
            availableControls();
            availableRooms();
            // availableRoomsList();
        };
        const leaveRoom = (data) => {
            if (!data.hasOwnProperty('room')) {
                this.log(`${getUsernameFromSocketID()} attempting to leave room with no room parameter.`);
                return;
            }
            if (data.room === "") {
                this.log(`leaveRoom room paramter was empty/blank.`);
                sendServerMessage(`leaveRoom room paramter was empty/blank.`);
                return;
            }
            // check if room is available
            this.log(`leave room  ${data.room}, ${snsp}`);
            if (this.IO.of(snsp).adapter.rooms.has(data.room) === true) {
                socket.leave(data.room);
                // socket.room = room;
                sendServerMessage('You have left room ' + data.room);
                // send client info on all rooms they're in
                myRooms(socket.id);
                allRooms();
                this.Users.forEach(user => {
                    availableRooms(user.id);
                    availableEvents(user.id);
                    availableControls(user.id);
                    availableRooms(user.id);
                    availableRoomsList(user.id);
                    myRoomsList(user.id);
                });
            }
            else {
                this.log(`Attepting to leave room that doesn't exist- ${data.room}`);
                sendServerMessage(`Attepting to leave room that doesn't exist- ${data.room}`);
            }
            return this;
        };
        // internal utility
        const getAllRoomsArray = (filter) => {
            if (filter || filter === undefined) {
                return Array.from(this.IO.of(snsp).adapter.rooms.keys())
                    .filter(room => !getConnectedSockets().includes(room));
            }
            else {
                return Array.from(this.IO.of(snsp).adapter.rooms.keys());
            }
        };
        // internal utility
        const getAllRoomsDetails = (filter) => {
            const _roomMap = new Map(this.IO.of(snsp).adapter.rooms);
            const rooms = Object.fromEntries(_roomMap);
            const newRoomObj = {};
            for (const key in rooms) {
                if (Object.prototype.hasOwnProperty.call(rooms, key)) {
                    if (filter || filter === undefined) {
                        if (getConnectedSockets().includes(key)) {
                            continue;
                        }
                        else {
                            const element = Array.from(rooms[key]);
                            newRoomObj[key] = element;
                        }
                    }
                    else {
                        const element = Array.from(rooms[key]);
                        newRoomObj[key] = element;
                    }
                }
            }
            return newRoomObj;
        };
        const allRooms = () => {
            // this.log('allRooms request received');
            const rooms = {
                rooms: getAllRoomsArray(true)
            };
            const roomDetails = {
                rooms: getAllRoomsDetails()
            };
            this.IO.of(snsp).emit('allRooms', rooms);
            this.IO.of(snsp).emit('allRoomDetails', roomDetails);
        };
        const myRooms = (whichSocket) => {
            if (whichSocket === null || whichSocket === undefined) {
                whichSocket = socket.id;
            }
            // GET ROOMS SOCKET BELONGS TO
            const tempRoomsSet = new Set(this.IO.of(snsp).adapter.sids.get(whichSocket));
            let myTempRoomsArray = Array.from(tempRoomsSet);
            myTempRoomsArray = myTempRoomsArray.filter(mr => mr !== whichSocket);
            const tempRoomsMap = new Map(this.IO.of(snsp).adapter.rooms);
            const myRoomsObject = {};
            myTempRoomsArray.forEach(room => {
                myRoomsObject[room] = Array.from(tempRoomsMap.get(room)).map(ru => getUsernameFromSocketID(ru));
            });
            this.IO.of(snsp).to(whichSocket).emit('myRooms', myRoomsObject);
        };
        const myRoomsList = (whichSocket) => {
            if (whichSocket === null) {
                whichSocket = socket.id;
            }
            if (whichSocket === undefined) {
                whichSocket = socket.id;
            }
            // GET ROOMS SOCKET BELONGS TO
            const tempRoomsSet = new Set(this.IO.of(snsp).adapter.sids.get(whichSocket));
            let tempRooms = [];
            if (tempRoomsSet !== undefined) {
                tempRooms = Array.from(tempRoomsSet);
            }
            tempRooms = tempRooms.filter(mr => mr !== whichSocket);
            const myRoomsListObject = {
                rooms: tempRooms
            };
            this.IO.of(snsp).to(whichSocket).emit('myRoomsList', myRoomsListObject);
            return tempRooms;
        };
        const availableRooms = (whichSocket) => {
            if (whichSocket === undefined) {
                whichSocket = socket.id;
            }
            const tempMap = new Map(this.IO.of(snsp).adapter.rooms);
            const roomsToExclude = Array.from(this.Users.keys()).concat(myRoomsList(whichSocket));
            const availableRoomsObject = {};
            for (const key of tempMap.keys()) {
                if (!roomsToExclude.includes(key)) {
                    let names = Array.from(tempMap.get(key));
                    names = names.map(n => getUsernameFromSocketID(n));
                    availableRoomsObject[key] = names;
                }
            }
            this.IO.of(snsp).to(whichSocket).emit('availableRooms', availableRoomsObject);
        };
        const availableRoomsList = (whichSocket) => {
            if (whichSocket === undefined) {
                whichSocket = socket.id;
            }
            const tempMap = new Map(this.IO.of(snsp).adapter.rooms);
            const _allRooms = Array.from(tempMap.keys()).filter(sr => !Array.from(this.Users.keys()).includes(sr));
            // GET ROOMS SOCKET BELONGS TO
            const availableRoomsArray = _allRooms.filter(room => !myRoomsList(whichSocket).includes(room));
            const availableRoomsListObject = {
                rooms: availableRoomsArray
            };
            this.IO.of(snsp).to(whichSocket).emit('availableRoomsList', availableRoomsListObject);
        };
        // functions lists room name and the clients within rooms
        const updateRooms = () => {
            allRooms();
            this.Users.forEach(user => {
                myRooms(user.id);
                myRoomsList(user.id);
                availableRooms(user.id);
                availableRoomsList(user.id);
            });
        };
        const sendError = (message) => {
            const _messageObject = {
                message
            };
            socket.emit(CHMessageType.ERROR, _messageObject);
        };
        // used
        // utilities
        const lowercaseString = (_string) => {
            return _string.toLowerCase();
        };
        const connectionSequence = () => {
            socket.emit('connected', 'connected');
            socket.emit('connection', 'connected');
            sendServerMessage('Collab-Hub Version: ' + this.Version + ". You're in Namespace " + snsp);
            addUser(_sock);
            updateRooms();
            allEvents();
            availableEvents();
            allControls();
            availableControls();
            myUsername();
        };
        socket.on("chPing", (pingObject) => {
            socket.emit('chPingBack', pingObject);
        });
        connectionSequence();
    }
    enumKeys(obj) {
        return Object.keys(obj).filter(k => Number.isNaN(+k));
    }
    isCHControlToServer(object) {
        return 'target' in object;
    }
}
exports.default = HUB;
