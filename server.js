const http = require('http');
require('dotenv').config();
const app = require('./app');
const express = require('express');
const SocketIO = require('socket.io');
var HttpStatus = require('http-status-codes');
const router = express.Router();
const bodyParser = require('body-parser');
const sql = require('mssql');
const conn = require('./routes/dbconn');
const routePool = new sql.ConnectionPool(conn);
//Usar las rutas
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const server = http.createServer(app);
const io = SocketIO.listen(server);

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use(express.static(__dirname + '/public'));

server.listen(port, () => {
    console.log(`[El servidor está corriendo en la dirección '${host}:${port}']`);
});

const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;

const portA = new SerialPort("COM3", {
  baudRate: 9600
});

const parser = portA.pipe(new ReadLine({ delimiter: '\r\n' }));

parser.on('open', function () {
  console.log('connection is opened');
});

parser.on('error', (err) => console.log(err));
portA.on('error', (err) => console.log(err));
