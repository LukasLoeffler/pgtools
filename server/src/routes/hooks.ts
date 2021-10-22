import { Request, Response } from "express"
import { getConnectionById } from "../config-handler";
const { Client } = require('pg')

var express = require('express'),
router = express.Router();

class TableHook {
    table: string;
    type: string;
    schema: string;
    hookEnabled: boolean;

    constructor(table: string, type: string, schema: string, hookEnabled: boolean) {
        this.table = table;
        this.type = type;
        this.schema = schema;
        this.hookEnabled = hookEnabled;
    }
}


async function checkIfConnectionHasActiveHook(client: any, tableName: string) {
    const queryString =
    `
        SELECT event_manipulation
        FROM  information_schema.triggers
        WHERE event_object_table = '${tableName}'
        ORDER BY event_object_table, event_manipulation
    `
    const result = await client.query(queryString)
    return Boolean(result.rows.length);
}

async function buildTableHookFromRow(client: any, row: any): Promise<TableHook> {
    const hookEnabled = await checkIfConnectionHasActiveHook(client, row.table_name)
    return new TableHook(row.table_name, row.table_type, row.table_schema, hookEnabled);
}

async function getAllTablesWithTriggers(client: any) {
    const publicTables = (await client.query("SELECT * FROM information_schema.tables WHERE table_schema = 'public'")).rows;
    const output: Array<TableHook> = [];

    for (const row of publicTables) {
        const tableHook = await buildTableHookFromRow(client, row);
        output.push(tableHook)
    };

    return output;
}

router.get('/:id', async (req: Request, res: Response) => {
    const connection = await getConnectionById(req.params.id)
    if (connection) {
        const client = new Client(connection)
        client.connect()
        const output = await getAllTablesWithTriggers(client);
        res.send(output);
        client.end();
    } else {
        res.send([]);
    }
});

router.post('/set/:name', async (req: Request, res: Response) => {
    const triggers = await setTriggerForTable(req.params.name, req.body);
    res.send(triggers);
});

async function getAllTriggers(client: any) {
    const queryString = "SELECT * FROM information_schema.triggers"
    return (await client.query(queryString)).rows;
}

async function removeAllTriggers(client: any) {
    const allTriggers = await getAllTriggers(client);

    for (const trigger of allTriggers) {
        await removeTrigger(client, trigger.event_object_table, trigger.trigger_name)
    }
}

async function removeTrigger(client: any, tableName: string, triggerName: string) {
    const queryString = `DROP TRIGGER IF EXISTS ${triggerName} ON ${tableName} CASCADE`
    return await client.query(queryString);
}



async function createTriggerForTable(client: any, tableName: string, triggerName: string) {
    const queryString = 
    `
        CREATE TRIGGER ${triggerName}
        AFTER INSERT OR UPDATE OR DELETE ON ${tableName}
        FOR EACH ROW EXECUTE PROCEDURE notify_event();
    `
    return await client.query(queryString);
}

async function setTriggerForTable(connectionId: string, tableList: Array<TableHook>) {
    const connection = await getConnectionById(connectionId)

    const client = new Client(connection)
    client.connect()
    await removeAllTriggers(client);

    for (const table of tableList) {
        
        if (table.hookEnabled) {
            await createTriggerForTable(client, table.table, "notify_trigger")
        }
    }

    const result = await getAllTablesWithTriggers(client);
    client.end();
    return result;
}

module.exports = router;