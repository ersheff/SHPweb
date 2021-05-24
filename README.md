# Collab-Hub Version 0.3.0b
Nick Hwang, Eric Sheffield, Anthony T. Marasco

## Table of Contents
1. [To Server](#To-the-Server)
2. [Modes](#Modes)
3. [From Server](#From-the-Server)


Description
This version of the Collab-Hub brings in the use of TypeScript, Dashboard page, and Preview of Electronc interfacing and style. 

The biggest change for the end user (client) is the shape of objects *coming-into* and *out-of* the server. 

- Server using TypeScript
- All message **values** will use JSON format details for the shape of each object in the details
- All object properties are **camelCase** 
- Changed Private modality renamed to Targeted
  - Mode: Targeted    
- All event names from server are camelCase 
chat, control, 
- All Classes are PascalCase
- Connection initiates a handshake.query check, expecting JSON formatted options


## To the Server

Description
:  This section descibes events the server has event listeners for. This section also describes the shape of the JSON objects that will go between server and client. 

### addUsername 
```
.emit('addUsername', (
    {
        username: <string>
    }
));
```
> This changes your username. This username will be used for elements of *chat, event,* and *control* source.
> Usernames should be single strings

---

### clearUsers
```
.emit('clearUsers');
```
> This clears all connected user data in your namespace. No other data/message/options should be passed along with with this socket event.

> The server will respond by emitting a new empty container for the *users* and *userDetails*. Details of these two events in *From Server* section.


### clearControls
```
.emit('clearControls');
```
> This commands the server to clear all control data in your namespace. 

> No other data/message/options should be passed along with with this socket event.

> The server will respond by emitting a new empty container for *controls*. Details in the *From Server* section.
---
### clearEvents
```
.emit('clearEvents');
```
> This commands the server to clear all event data in your namespace. 

> No other data/message/options should be passed along with with this socket event.

> The server will respond by emitting a new empty container for *events*. Details in the *From Server* section.

---
### chat - *Target
```
.emit('chat', (
    {
        chat: <string>,
        target: <string> 'all', roomname, or username
    }
));
```
> This sends chat messages

> Chat values should only be string

> The server will send the chat data to the possible targets:
> (1) 'all': every user in the namespace, (2) a roomname, (3) username

> Server will emit with event name 'chat'. See section for 'to Client' for object details.

---
### event - *Mode & Target
```
.emit('event', (
    {
      header: <string>,
      from: <string>,
      mode: 'publish' or 'push',
      target: <string> 'all', roomname, or username
    }
));
```
> This event calls a Collab-Hub 'Event' which follows the Mode/Target interface.

> mode: 'publish' or 'push'

> target: (1) 'all': every user in the namespace, (2) a roomname, (3) username

> Server will emit with event name 'event'. See section for 'to Client' for object details.

> See Section "*Mode & Target" for more details

---
### control - *Mode & Target
```
.emit('control', (
    {
      header: <string>,
      values: <string> | <object> | <array>,
      mode: 'publish' or 'push'
      target: 'all', roomname <string> , or username<string> 
    }
));
```
> This event send a Collab-Hub 'control' data object which follows the Mode/Target interface.

> mode: 'publish' or 'push'

> target: (1) 'all': every user in the namespace, (2) a roomname, (3) username

> Server will emit with event name 'control'. See section for 'to Client' for object details.

> See Section "*Mode/Target" for more details

### getEvents
```
.emit('getEvents');
```
> This event has the server send back all '**publish**' events. 

> See section on 'events' in the 'From Server' section.

> No other data/message/options should be passed along with with this socket event.

### getUsers
```
.emit('getUsers');
```
> This event has the server send back all user data in a namespace.

> The server responds with '**allUsers**' and '**allUserDetails**', see 'from Server' section for details.

> See section on 'users' in the From Server section.

> No other data/message/options should be passed along.

### getMyControls
```
.emit('myControls');
```
> This event has the server send back control headers user is observing as well as the available obserable controls.

> The server responds with '**myControls**' and '**availableControls**'. See 'from Server' section for details.

> No other data/message/options should be passed along.


### getMyEvents
```
.emit('getMyEvents');
```
> This event has the server send back events headers user is observing as well the available observable events.

> The server responds with '**mtEvents**' and '**availableEvents**'. See 'from Server' section for details.

> No other data/message/options should be passed along.

### getMyRooms
```
.emit('getMyRooms');
```
> This event has the server send back a list of roomnames user has joined.

> The server responds with '**myRooms**'. See 'from Server' section for details.

> No other data/message/options should be passed along.

### getAvailableRooms
```
.emit('getAvailableRooms');
```
> This event has the server send back a list of available roomnames (user has not joined).

> The server responds with '**availableRooms**'. See 'from Server' section for details.

> No other data/message/options should be passed along.



### dumpControls
```
.emit('dumpControls');
```
> This event has the server send back all control data in a namespace.

> The server responds with '**controlDump**'. See 'from Server' section for details.

> See section on 'users' in the From Server section.

> No other data/message/options should be passed along.


### clearUsers
```
.emit('clearUsers');
```
> This event has the server to (1) clear all users in namespace and (2) emit an empty container from the 'users' event header. 

> See section on 'users' in the From Server section.

> No other data/message/options should be passed along with with this socket event.
---

### getControl
```
.emit('getControl', (
    {
        header: <string>
    }
));
```

> This event requests the server to send the latest control value of the control header.

> This a one-off and 'as-immediate-as-possible' request. If client wants data again, client must emit *getControl* again.

> This is the most naive method of requesting control data.

---
### observeControl
```
.emit('observeControl', (
    {
        header: <string>
    }
));
```
> This event tells server you want to observe a control based on its header. If the heading does not exist, client is unable to observe that control

> When server receives value/values of that control, server will emit a 'control' event to the client. See section on 'control' in the **From Server** section.

> See section on 'Observer Modeling' for more information.

### observeAllControl
```
.emit('observeAllControl', (
    {
        observe: <bool> true or false| <string> 'true' or 'false'
    }
));
```
> This event tells server you want to observe/unobserve all controls.

> When server receives value/values of ALL control, server will emit a 'control' event to the client. See section on 'control' in the **From Server** section.

> See section on 'Observer Modeling' for more information.

### unobserveControl
```
.emit('unobserveControl', (
    {
        header: <string>
    }
));
```
> This event tells server you want to unobserve a control by sending its header. 

> If client is currently observe a control, they will no longer receive 'control' data from value changes.

### observeEvent
```
.emit('observeControl', (
    {
        header: <string>
    }
));
```
> This event tells server you want to observe a event by sending its header. If the event does not exist, client is unable to observe that control.

> When server receives that event occurance, server will emit an 'event' to client. See section on 'event' in the **From Server** section.

> See section on 'Observer Modeling' for more information.

### unobserveEvent
```
.emit('unobserveControl', (
    {
        header: <string>
    }
));
```
> This event tells server you want to unobserve a event based on its header. 

> If client is currently observing an event, they will no longer receive 'event' data from future occurances.

### observeAllEvents
```
.emit('observeAllEvents', (
    {
        observe: <bool> true or false| <string> 'true' or 'false'
    }
));
```
> This event tells server you want to observe/unobserve all events.

> When server receives value/values of ALL events, server will emit an 'event' event to the client. See section on 'event' in the **From Server** section.

> See section on 'Observer Modeling' for more information.



---

# Modes
Modes describe the two main data communication models Collab-Hub allows: **Publish** and **Push**. These two models may be used separately or in combination with each other. Modes are selected by the sender of data. Data objects of Control, Event, and Chat must have a parameter of 'mode'.

## Publish
Publish model allows for a 'pub/sub' / 'observer' / 'onValue' communication scheme where 
1. availabile data is published to connected clients based on the data's *target* parameter of 
   - 'all' or
   - roomname or
   - username
2. clients may **observe / unobserve** that specific data by header
3. observing clients receive the latest data values
4. latest data parameters of *target*, *from* (sender), *values* are stored on the server

## Push
Push model allows for a 'stateless' data routing communication scheme where
1. target clients receive data

Unlike Publish model, Push data is sent to clients without prior action by the client. Data is not stored on the server.

**This is the most programmatically niave communication and computationally expensive on server.


--- 
## From Server 

### control
```
 {
     header: <string>,
     values: <number> | <number> [], | <string> | <string>[]
 }
```
> This data object is a response to *getControl* or an observed control. 

### event
```
{
     header: <string>,
     from: <string> 
 }
```
> This data object is a response from events triggered.

> *header* parameter is name of the event.

> *from* parameter is the username of the client/user.

### chat
```
{
    id: <string>,
    chat: <string>
}
```
> This data object is a response from a chat message sent to your username or a room you joined or the namespace you're in. The sender decided how it was routed to you.

> *id* parameter is the username of the sender.

> *chat* parameter is the chat message.

### serverMessage
```
{
    message: <string>
}
```
> This message is server-relevant messages, which may include errors, notifications, and version. 

### myUsername
```
{
    username: <string>
}
```
> This message contains the username stored on the server.

### myEvents
```
{
    events: <string>[]
}
```
This message contains the events user/client is 
-------
# Ignore anything below this
---------








interface CHMessage {
    message: string
}

interface CHEvent {
    header: string,
    from: string,
    observers?: string[]
    mode?: CHMode
    target?: CHTarget
}

interface CHEventArray{
    data: CHEvent []
}

interface CHControl {
    header: string,
    values: string | object,
    from?: string,
    observers?: string[]
    mode?: CHMode
    target?: CHTarget
}

interface CHChat {
    id: string,
    chat: string
}

interface CHUserDetails {
    username: string,
    id: string,
    observeallcontrol?: string | boolean,
    observeallevents?: string | boolean
}

class CHUser extends Map<string, CHUserDetails> {
    constructor (otherMap : Map<string, CHUserDetails>){
        super(otherMap);
    }
}

interface CHConstructorptions{
    version?: string,
    io: any
    consoleDisplay? : string
}

interface CHQuery {
    username: string
}