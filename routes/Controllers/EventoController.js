const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sql = require('mssql');
const conn = require('../dbconn');
const routePool = new sql.ConnectionPool(conn);
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
var HttpStatus = require('http-status-codes');
var GenerateId = require("generate-id"),
g = new GenerateId();





function generateMessageId(){ 
    var msgId = ''
    msgId =    g.generate({
        length : 3,
        include  : ["upper", "down", "numbers"],
        add : {
          before : "EVE"      
        }
      });

      return msgId
}

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());



//Se crea un evento
router.post('/agregarEvento', (req, res) => {

    const idEvento = generateMessageId()
    const pReportado = req.body.pReportado;
    const tRealizado = req.body.tRealizado;
    const fecha = req.body.fecha;
    const horas = req.body.horas;
    const minutos = req.body.minutos;
    const pResueto = req.body.pResuelto;
    const motivo = req.body.motivo;
    const labor = req.body.labor;
    const cCosto = req.body.cCosto;
    const sucursal = req.body.sucursal;
    const cedula = req.body.cedula;

    routePool.connect().then(pool => {
        return pool.request()
            .output('success', sql.Bit,0)
            .input('idEvento', sql.Char(6), idEvento)
            .input('pReportado', sql.VarChar(30), pReportado)
            .input('tRealizado', sql.VarChar(30), tRealizado)
            .input('fecha', sql.VarChar, fecha)
            .input('horas', sql.Int, horas)
            .input('minutos', sql.Int, minutos)
            .input('pResuelto', sql.VarChar(2), pResueto)
            .input('motivo', sql.Char(4), motivo)
            .input('labor', sql.Char(4), labor)
            .input('cCosto', sql.Char(4), cCosto)
            .input('sucursal', sql.Char(4), sucursal)
            .input('cedula', sql.Char(11), cedula)
            .execute('agregarEvento'); //Cambiar por el sp de agregar evento

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});


router.get('/obtenerEvento', (req, res) => {
    routePool.connect().then(pool => {
        return pool.request()
            .output('success', sql.Bit,0)
            .execute('getEvento');

    }).then(val => {

        routePool.close();
        console.log(val.recordset)
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});


//Eliminar un evento
router.delete('/eliminarEvento', (req, res) => {

    const idEvento = req.body.idEvento;

    routePool.connect().then(pool => {
        return pool.request()
            .input('idEvento', sql.Char(6), idEvento)
            .output('success', sql.Bit,0)
            .execute('eliminarEvento'); 

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});












module.exports = router;