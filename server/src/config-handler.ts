const fs = { ...require("fs"), ...require("fs/promises") };
import * as path from 'path';
import { Command } from './domain/command';
import { Connection } from './domain/connection';


const configPath = path.join(__dirname, '../config/config.json');

// If no config file exists initially, create an empty one
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

export async function getConnectionById(id: string): Promise<Connection | undefined> {
    const allConnections = await loadConnections();
    return allConnections.find((connection: Connection) => connection.id === id);
}

export async function checkIfConnectionAlreadyExists(connectionId: string): Promise<Boolean> {
    const existingConnection = await getConnectionById(connectionId);
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
    const connectionExists = await checkIfConnectionAlreadyExists(connection.id);
    if (connectionExists) {
        await removeConnection(connection.id);
        await addConnection(connection)
    } else {
        console.log("connection_does_not_exists")
    }
}

export async function removeConnection(connectionId: String) {
    let config = await loadConfigFromFile();
    config.connections = config.connections.filter((connection: Connection) => connection.id !== connectionId);
    await writeConfigToFile(config)
}

export async function getCommandById(id: number): Promise<Command | undefined> {
    const allCommands = await loadCommands();
    return allCommands.find((command: Command) => command.id === id);
}

export async function loadCommands(): Promise<Array<Command>> {
    const settings = await loadConfigFromFile();
    return settings.commands.sort((a: Command, b: Command) => a.id - b.id);
}

export async function removeCommand(commandId: number) {
    let config = await loadConfigFromFile();
    config.commands = config.commands.filter((command: any) => command.id !== commandId);
    await writeConfigToFile(config)
}

export async function addCommand(command: Command) {
    let config = await loadConfigFromFile();
    config.commands.push(command);
    await writeConfigToFile(config)
}

export async function updateCommand(command: Command) {
    await removeCommand(command.id);
    await addCommand(command);
}
