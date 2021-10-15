import { Request, Response } from "express"
import { loadCommands, removeCommand, addCommand, getConnectionByName } from '../config-handler'
import { Connection } from "../domain/connection";
import { getErrorByCode } from "../pg-error-codes";

var express = require('express');
const router = express.Router();

router.get('/all', async (req: Request, res: Response) => {
    const allCommands = await loadCommands()
    res.send(allCommands);
});

router.post('/', async (req: Request, res: Response) => {
    addCommand(req.body);
    res.send();
});

router.post('/execute', async (req: Request, res: Response) => {
    const connectionName = req.body.connectionName;
    const query = req.body.query;
    const connection = await getConnectionByName(connectionName);
    const connInstance = Connection.fromObject(connection);
    const client = connInstance.getClient();
    client.connect();

    try {
        let result = await client.query(query);

        const output = {
            status: "success",
            payload: result.rows,
            message: null
        }
    
        res.send(output);
    } catch (error: any) {

        const response = {
            "status": "error",
            "error_type": getErrorByCode(error.code),
            "message": getErrorByCode(error.code)
        }
        res.send(response);
    }

});

router.delete('/:name', function(req: Request, res: Response){
    removeCommand(req.params.name);
    res.send();
});


module.exports = router;