import createSubscriber, { Subscriber } from "pg-listen"
import { sio } from "./index"

import { getConnectionByName as getConnection } from "./config-handler"
import { Connection } from "./domain/connection";

class ConnectionInstance {
    name: string;
    subscriber: Subscriber;

    constructor(name: string, subscriber: Subscriber) {
        this.name = name;
        this.subscriber = subscriber;
    }
}

let connectionStore: Array<ConnectionInstance> = [];
let eventIndex = 0;

export async function startListen(dbName: string) {
    const connection: Connection | undefined = await getConnection(dbName);

    if (!connection) throw new Error(`Connection is not present`);

    const conString = `postgresql://${connection.user}:${connection.password}@${connection.host}:${connection.port}/${dbName}`
    const subscriber: Subscriber = createSubscriber({ connectionString: conString })
    
    subscriber.notifications.on("pg_change", (payload) => {
        payload.index = eventIndex; 
        sio.emit("databaseEvent", payload)
        eventIndex++;
    })
    
    try {
        subscriber.connect()
        subscriber.listenTo("pg_change")

        const connection = new ConnectionInstance(dbName, subscriber)
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

function getConnectionByName(name: string): ConnectionInstance | undefined {
    return connectionStore.find(connection => connection.name === name);
}

function removeConnectionFromStore(name: string) {
    connectionStore = connectionStore.filter(connection => connection.name !== name)
}

export function endListen(dbName: string) {
    const connection = getConnectionByName(dbName);
    removeConnectionFromStore(dbName);
    connection?.subscriber.close();
}

export function getActiveConnections() {
    return connectionStore;
}

export function getConnectionStatus(name: string) {
    const connection = getConnectionByName(name);
    return (connection === undefined) ? false : true;
}