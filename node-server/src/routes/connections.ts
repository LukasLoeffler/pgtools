import { Connection } from '../domain/connection'
import { loadConnections, addConnection, removeConnection, updateConnection } from '../config-handler'
import { getActiveConnections, endListen, startListen, getConnectionStatus, resetEventIndex } from '../connection-store'
import { Request, Response } from "express"
import { generateGeneralTrigger } from '../pg-tools';

var express = require('express');
const router = express.Router();


router.post('/', async (req: Request, res: Response) => {
    try {
        const connection = new Connection(req.body.name, req.body.database, req.body.user, req.body.password, req.body.host, req.body.port);
        const connectionValidity = await connection.checkValidity();
        if (!connectionValidity.valid) throw new Error(connectionValidity.message);
        await addConnection(connection);
        return res.send(connection);
    } catch (error: any) {
        return res.status(400).send({ message: error.message });
    }
})

router.put('/', async (req: Request, res: Response) => {
    try {
        const connection = new Connection(req.body.name, req.body.database, req.body.user, req.body.password, req.body.host, req.body.port);
        await updateConnection(connection);
        return res.send(connection);
    } catch (error: any) {
        return res.status(400).send({ message: error.message });
    }
})

router.get('/all', async (req: Request, res: Response) => {
    const allConnections = await loadConnections()
    res.send(allConnections);
});

router.get('/by-id/:id', async (req: Request, res: Response) => {
    const connection = await 
    res.send(startListen(req.params.id));
});

router.get('/all/active', function(req: Request, res: Response){
    res.send(getActiveConnections());
});

router.get('/listen-start/:id', async (req: Request, res: Response) => {
    await generateGeneralTrigger(req.params.id)
    res.send(startListen(req.params.id));
});

router.get('/listen-end/:id', function(req: Request, res: Response){
    res.send(endListen(req.params.id));
});

router.get('/status/:id', function(req: Request, res: Response){
    res.send({connected: getConnectionStatus(req.params.id)});
});

router.get('/reset-index', function(req: Request, res: Response) {
    resetEventIndex();
    res.send({
        status: "success",
        message: "Index reset successful."
    });
});

router.post('/check', async (req: Request, res: Response) => {
    const connection = new Connection(req.body.name, req.body.database, req.body.user, req.body.password, req.body.host, req.body.port);
    const connectionValidity = await connection.checkValidity();
    return res.send(connectionValidity);
})

router.delete('/:name', function(req: Request, res: Response){
    removeConnection(req.params.name);
    res.send();
});

module.exports = router;