import { Request, Response } from "express"
import path from "path";
import { loadConfigFromFile } from '../config-handler'
const fs = require("fs")

var express = require('express');
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const config = await loadConfigFromFile();
    res.send(config);
});

router.get('/download', async (req: Request, res: Response) => {
    const configPath = path.join(__dirname, '../../config/config.json');
    res.sendFile(configPath);
});

module.exports = router;