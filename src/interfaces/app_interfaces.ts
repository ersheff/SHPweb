// to Server

interface CHControlToServer {
    header: string,
    values: string | object,
    mode: string
    target: string
}

interface CHEventToServer {
    header: string,
    mode: string,
    target: string
}

interface CHChatToServer {
    chat: string,
    target: string
}

interface CHUsername {
    username: string
}

interface CHObserve{
    header : string
}

interface CHQuery {
    username: string,
    control?: CHControlToServer,
    controls? : CHControlToServer[],
    event?: CHEventToServer,
    events?: CHEventToServer[]
}

// to Client

interface CHControlToClient {
    header: string,
    values: string | object | string [],
    from?: string,
}

interface CHEventToClient {
    header: string,
    from: string
}

interface CHChatToClient {
    id: string,
    chat: string,
}

interface CHControlsToClient{
    controls: CHControl[]
}

// internal

interface CHControl {
    header: string,
    values: string | object,
    from: string,
    observers?: string[]
    mode: string
    target: CHTarget | string
}

interface CHEvent {
    header: string,
    from?: string,
    observers?: string[],
    mode: string
    target: CHTarget | string
}

interface CHControls{
    controls: CHControl []
}

interface CHEvents{
    events: CHEvent []
}

interface CHMessage {
    message: string
}

interface CHObserveAll{
    observe: boolean | string
}

interface CHBoolState {
    state: boolean | string
}


interface CHClearEvents {
    header: string | string []
}

interface CHClearControls {
    header: string | string []
}

interface CHUserDetails extends Object{
    username: string,
    id: string,
    myControls?: string[],
    myEvents?: string[],
    observingEvent?: string[]
    observingControl?: string[]
    observeallcontrol?: boolean,
    observeallevents?: boolean
}

class CHUser extends Map<string, CHUserDetails> {
    constructor (otherMap : Map<string, CHUserDetails>){
        super(otherMap);
    }
}

interface CHConstructorOptions{
    version?: string,
    io: any
    consoleDisplay? : boolean | string,
    verboseServerMessage? : boolean | string,
    name?: string
}

interface CHRoomDetail{
    room: string,
    users: string[]
}

interface CHRoom{
    room: string
}

interface CHRoomDetails {
    rooms: CHRoomDetail[]
}

interface CHAllRooms {
    rooms: string []
}

