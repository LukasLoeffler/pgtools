import json
import psycopg2
from psycopg2 import errors
import select
from psycopg2.extras import RealDictCursor


NOT_READY = ([], [], [])
class Connection:
    def __init__(self, database, user, password, host="localhost", port=5432):
        self.database = database
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.con = psycopg2.connect(database=database , user=user, password=password, host=host, port=port)
        self.con.autocommit = True
        self.cur = self.con.cursor()

    def __repr__(self):
        return f"DB: {self.database} -- User: {self.user} -- Password: {self.password} -- Host: {self.host} -- Port: {self.port}"

    def as_dict(self):
        return {"database": self.database, "user": self.user, "password": self.password, "host": self.host, "port": self.port}

    def close(self):
        self.cur.close()
        self.con.close()

    def create_general_notify_event(self):
        exec_string = """
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
        """

        self.cur.execute(exec_string)
        self.con.commit()
        #print("notify_event() trigger function successfully created ✔")

    
    def create_trigger_for_table(self, tablename):
        exec_string = f"""
        CREATE TRIGGER notify_trigger
        AFTER INSERT OR UPDATE OR DELETE ON {tablename}
        FOR EACH ROW EXECUTE PROCEDURE notify_event();
        """
        self.cur.execute(exec_string)
        self.con.commit()


    def get_all_triggers(self):
        exec_string = "select * from information_schema.triggers"
        self.cur.execute(exec_string)
        return self.cur.fetchall()


    def trigger_tuple_to_dict(self, trigger):
        trigger_name = trigger[2]
        method = trigger[3]
        database = trigger[4]
        table = trigger[6]
        code = trigger[9]
        return {"name": trigger_name, "after": method, "database": database, "table": table, "code": code}


    def get_all_triggers_as_dict(self):
        triggers = self.get_all_triggers()
        dict_list = []
        for trigger in triggers:
            dict_list.append(self.trigger_tuple_to_dict(trigger))

        return dict_list


    def remove_trigger(self, table_name, trigger_name):
        exec_string = f"DROP TRIGGER IF EXISTS {trigger_name} ON {table_name} CASCADE"
        self.cur.execute(exec_string)
        self.con.commit()


    def remove_all_triggers_for_table(self, table_name):
        triggers = self.get_all_triggers()

        for trigger in triggers:
            trigger_name = trigger[2]
            method = trigger[3]
            database = trigger[4]
            table = trigger[6]
            #print(f"Trigger: {trigger_name} - Method: {method} - Database: {database} - Table: {table}")
            if (table == table_name):
                self.remove_trigger(table, trigger_name)

    
    def remove_all_triggers_for_database(self):
        triggers = self.get_all_triggers()

        for trigger in triggers:
            trigger_name = trigger[2]
            method = trigger[3]
            database = trigger[4]
            table = trigger[6]

            self.remove_trigger(table, trigger_name)


    def get_all_table_names(self):
        self.cur.execute("""SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'""")
        table_list = []
        for table in self.cur.fetchall():
            print(table[0])
            table_list.append(table[0])
        return table_list

    
    def get_all_tables_with_trigger(self):
        self.cur.execute("""SELECT * FROM information_schema.tables WHERE table_schema = 'public'""")
        table_list = []
        for table in self.cur.fetchall():

            table_schema = table[1]
            table_name = table[2]
            table_type = table[3]

            exec_string = f"""
            SELECT event_manipulation
            FROM  information_schema.triggers
            WHERE event_object_table = '{table_name}'
            ORDER BY event_object_table, event_manipulation
            """
            self.cur.execute(exec_string)
            result = self.cur.fetchall()

            table = {
                "table": table_name, 
                "type": table_type,
                "schema": table_schema,
                "trigger_enabled": bool(result)
            }  
            table_list.append(table)
        
        return table_list


    def set_trigger_for_tables(self, tables):
        self.remove_all_triggers_for_database()
        for table in tables:
            if table["trigger_enabled"]:
                self.create_trigger_for_table(table["table"])

        return self.get_all_tables_with_trigger()

    
    def execute_command(self, command):
        response = {}
        try:
            cur = self.con.cursor(cursor_factory=RealDictCursor)
            cur.execute(command)
            result = cur.fetchall()

            response = {
                "status": "success",
                "payload": result,
                "message": None
            }
            return response

        except Exception as e:
            response = {
                "status": "error",
                "error_type": type(e).__name__,
                "message": str(e).split("\n")[0]
            }

            # This is no error per se, just an exception for empty result of fetchall() 
            # which ok for queries without output
            if isinstance(e, psycopg2.ProgrammingError) and e.args[0] == 'no results to fetch':
                error_message = str(e).split("\n")[0]
                response = {
                    "status": "success",
                    "payload": None,
                    "message": e.args[0]
                }

            return response
