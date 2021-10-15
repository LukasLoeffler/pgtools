const { Client } = require('pg')
import { getConnectionByName } from "./config-handler";

export async function generateGeneralTrigger(connectionName: string) {

    const connection = await getConnectionByName(connectionName);

    const client = new Client(connection);

    await client.connect()

    const queryString = 
    `
    CREATE OR REPLACE FUNCTION notify_event() RETURNS TRIGGER AS $$
        DECLARE
            payload JSON;
            payload_new JSON;
            payload_old JSON;
        BEGIN
            payload_new = json_build_object('', '');
            payload_old = json_build_object('', '');

            IF (TG_OP = 'DELETE') THEN
            payload_old = row_to_json(OLD);
            END IF;

            IF (TG_OP = 'INSERT') THEN
            payload_new = row_to_json(NEW);
            END IF;

            IF (TG_OP = 'UPDATE') THEN
            payload_new = row_to_json(NEW);
            payload_old = row_to_json(OLD);
            END IF;

            payload = json_build_object(
                'table', TG_TABLE_NAME,
                'action', TG_OP,
                'data', payload_new,
                'data_old', payload_old,
                'database', current_database(),
                'timestamp', transaction_timestamp()
            );


            PERFORM pg_notify('pg_change', payload::text);

            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
    `
    await client.query(queryString)
}