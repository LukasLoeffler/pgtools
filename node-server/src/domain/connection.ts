const { Client } = require('pg')
import { checkIfConnectionAlreadyExists } from "../config-handler";
import { getErrorByCode } from "../pg-error-codes";

class Validity {
    valid: boolean;
    message: string | undefined;

    constructor(valid: boolean, message: string | undefined) {
        this.valid = valid;
        this.message = message;
    }
}

export class Connection {
    name: string;
    database: string;
    user: string;
    password: string;
    host: string;
    port: number;

    constructor(name: string, database: string, user: string, password: string, host: string, port: number) {
        this.name = name;
        this.database = database;
        this.user = user;
        this.password = password;
        this.host = host;
        this.port = port;
    }

    static fromObject(obj: any): Connection {
        return new Connection(obj.name, obj.database, obj.user, obj.password, obj.host, obj.port);
    }

    public tostring = () : string => {
        return `Connection (name: ${this.name})`;
    }

    public getClient() {
        return new Client({
            user: this.user,
            host: this.host,
            database: this.database,
            password: this.password,
            port: this.port,
            client_encoding: "utf-8"
        })
    }


    public async checkValidity(): Promise<Validity> {

        const connectionAlreadyExists = await checkIfConnectionAlreadyExists(this.name);
        if (connectionAlreadyExists) {
            return {
                valid: false,
                message: "connection_already_exists"
            };
        }

        const client = this.getClient();

        try {
            await client.connect()
            return {
                valid: true,
                message: "success"
            };
        } catch (error: any) {
            return {
                valid: false,
                message: getErrorByCode(error.code)
            };
        }
    }
}