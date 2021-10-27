import createSubscriber, { Subscriber } from "pg-listen"
import { sio } from "./index"

import { getConnectionById as getConnection } from "./config-handler"
import { Connection } from "./domain/connection";

class ConnectionInstance {
    id: string;
    subscriber: Subscriber;

    constructor(id: string, subscriber: Subscriber) {
        this.id = id;
        this.subscriber = subscriber;
    }
}

let connectionStore: Array<ConnectionInstance> = [];
let eventIndex = 0;

export async function startListen(connectionId: string) {
    const connection: Connection | undefined = await getConnection(connectionId);

    if (!connection) throw new Error(`Connection is not present`);
    
    const conString = `postgresql://${connection.user}:${connection.password}@${connection.host}:${connection.port}/${connection.database}`
    const subscriber: Subscriber = createSubscriber({ connectionString: conString })

    subscriber.notifications.on("pg_change", (payload) => {
        payload.index = eventIndex; 
        sio.emit("databaseEvent", payload)
        eventIndex++;
    })

    subscriber.events.on("error", (error: Error) => console.log("Error:", error));

    
    try {
        subscriber.connect()
        subscriber.listenTo("pg_change")

        const connection = new ConnectionInstance(connectionId, subscriber)
        addConnectionToStore(connection);
    } catch (error) {
        console.log(error);
    }
}

export function resetEventIndex() {
    eventIndex = 0;
}

function addConnectionToStore(connection: ConnectionInstance) {
    connectionStore.push(connection);
}

function getConnectionById(id: string): ConnectionInstance | undefined {
    return connectionStore.find(connection => connection.id === id);
}

function removeConnectionFromStore(id: string) {
    connectionStore = connectionStore.filter(connection => connection.id !== id)
}

export function endListen(id: string) {
    const connection = getConnectionById(id);
    removeConnectionFromStore(id);
    connection?.subscriber.close();
}

export function getActiveConnections() {
    return connectionStore;
}

export function getConnectionStatus(id: string) {
    const connection = getConnectionById(id);
    return (connection === undefined) ? false : true;
}