import { Request, Response } from "express"
import { loadCommands, removeCommand, addCommand, updateCommand, getConnectionById, getCommandById } from '../config-handler'
import { Command } from "../domain/command";
import { Connection } from "../domain/connection";
import { getErrorByCode } from "../pg-error-codes";
const crypto = require("crypto");

var express = require('express');
const router = express.Router();

router.get('/all', async (req: Request, res: Response) => {
    const allCommands = await loadCommands()
    res.send(allCommands);
});

router.post('/', async (req: Request, res: Response) => {
    const id = crypto.randomBytes(16).toString("hex");
    const command = new Command(id, req.body.name, req.body.query, req.body.severity);
    await addCommand(command);
    res.send();
});

router.put('/', async (req: Request, res: Response) => {
    const command = new Command(req.body.id, req.body.name, req.body.query, req.body.severity);
    await updateCommand(command);
    const updatedCommand = await getCommandById(command.id)
    res.send(updatedCommand);
});

router.post('/execute', async (req: Request, res: Response) => {
    const connectionId = req.body.connectionId;
    const query = req.body.query;
    const connection = await getConnectionById(connectionId);

    const connInstance = Connection.fromObject(connection);
    const client = connInstance.getClient();
    await client.connect();

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

router.delete('/:id', function(req: Request, res: Response){
    removeCommand(req.params.id);
    res.send();
});


module.exports = router;