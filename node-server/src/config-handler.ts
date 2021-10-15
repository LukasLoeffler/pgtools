const fs = { ...require("fs"), ...require("fs/promises") };
import * as path from 'path';
import { Connection } from './domain/connection';


const configPath = path.join(__dirname, '../config.json');


fs.exists(configPath, function (exists: boolean) {
    if (!exists) {
        const emptyConfig = {
            connections: [],
            commands: []
        }

        fs.writeFile(configPath, JSON.stringify(emptyConfig, null, 4), 'utf8')
    }
});

export async function loadConfigFromFile(): Promise<any> {
    let fileContents = await fs.readFile(configPath, 'utf8')
    fileContents = JSON.parse(fileContents);
    return fileContents;
}

export async function writeConfigToFile(config: any): Promise<any> {
    let fileContents = await fs.writeFile(configPath, JSON.stringify(config, null, 4), 'utf8')
}

export async function loadConnections(): Promise<Array<Connection>> {
    const settings = await loadConfigFromFile();
    return settings.connections;
}

export async function getConnectionByName(name: string): Promise<Connection | undefined> {
    const allConnections = await loadConnections();
    return allConnections.find((connection: Connection) => connection.name === name);
}

export async function checkIfConnectionAlreadyExists(connectionName: string): Promise<Boolean> {
    const existingConnection = await getConnectionByName(connectionName);
    return Boolean(existingConnection);
}

export async function addConnection(connection: Connection) {
    const connectionExists = await checkIfConnectionAlreadyExists(connection.name);
    if (!connectionExists) {
        let config = await loadConfigFromFile();
        config.connections.push(connection);
        await writeConfigToFile(config)
    } else {
        console.log("connection_already_exists")
    }
}

export async function updateConnection(connection: Connection) {
    const connectionExists = await checkIfConnectionAlreadyExists(connection.name);
    if (connectionExists) {
        let config = await loadConfigFromFile();
        removeConnection(connection.name);
        config.connections.push(connection);
        await writeConfigToFile(config)
    } else {
        console.log("connection_does_not_exists")
    }
}

export async function removeConnection(connectionName: String) {
    let config = await loadConfigFromFile();
    config.connections = config.connections.filter((connection: Connection) => connection.name !== connectionName);
    await writeConfigToFile(config)
}


export async function loadCommands(): Promise<Array<Connection>> {
    const settings = await loadConfigFromFile();
    return settings.commands;
}

export async function removeCommand(commandName: String) {
    let config = await loadConfigFromFile();
    config.commands = config.commands.filter((command: any) => command.name !== commandName);
    await writeConfigToFile(config)
}

export async function addCommand(command: any) {
    let config = await loadConfigFromFile();
    config.commands.push(command);
    await writeConfigToFile(config)
}
