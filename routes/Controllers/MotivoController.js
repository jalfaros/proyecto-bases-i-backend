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
        length : 2,
        include  : ["numbers", "upper"],
        add : {
          before : "MT"      
        }
      });

      return msgId
}


router.get('/getMotivo', (req, res) => {
    routePool.connect().then(pool => {
        return pool.request()
            .input('isActive', sql.Int, req.query.isActive)
            .output('success', sql.Bit,0)
            .execute('getMotivo');

    }).then(val => {

        routePool.close();
        console.log(val.recordset)
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});


//Actualizar motivo
router.put('/actualizarMotivo', (req, res) => {

    const tipoMotivo = req.body.tipoMotivo;
    const descripcion = req.body.descripcion;
    const estado = req.body.estado;

    routePool.connect().then(pool => {
        return pool.request()
            .input('estado', sql.Bit, estado)
            .input('descripcion', sql.VarChar(30), descripcion)
            .input('tipoMotivo', sql.Char(4), tipoMotivo)
            .output('success', sql.Bit,0)
            .execute('actualizarMotivo'); 

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});


//Se crea un motivo
router.post('/agregarMotivo', (req, res) => {

    const tipoMotivo = generateMessageId()
    const descripcion = req.body.descripcion;

    routePool.connect().then(pool => {
        return pool.request()
            .input('tipoMotivo', sql.Char(4), tipoMotivo)  
            .input('descripcion', sql.VarChar(30), descripcion)
            .output('success', sql.Bit,0)    
            .execute('crearMotivo');

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});




module.exports = router;