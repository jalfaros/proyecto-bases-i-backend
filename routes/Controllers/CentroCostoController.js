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
        include  : ["upper", "numbers"],
        add : {
          before : "CT"      
        }
      });

      return msgId
}


router.get('/centroCosto', (req, res) => {
    routePool.connect().then(pool => {
        return pool.request()
            .input ('isActive', sql.Int, req.query.isActive)           
            .output('success', sql.Bit,0)
            .execute('getCentroCosto');

    }).then(val => {

        routePool.close();
        console.log(val.recordset)
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});


//Actualizar CentroCosto
router.put('/actualizarCentroCosto', (req, res) => {

    const idCentroCosto = req.body.idCentroCosto;
    const descripcion = req.body.descripcion;
    const estado = req.body.estado;

    routePool.connect().then(pool => {
        return pool.request()
            .input('estado', sql.Bit, estado)
            .input('descripcion', sql.VarChar(30), descripcion)
            .input('idCentroCosto', sql.Char(4), idCentroCosto)
            .output('success', sql.Bit,0)
            .execute('actualizarCentroCosto'); 

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});

//Se crea un Centro de Costo
router.post('/agregarCentroCosto', (req, res) => {

    const idCentroCosto = generateMessageId()
    const descripcion = req.body.descripcion;

    routePool.connect().then(pool => {
        return pool.request()
            .input('idCentroCosto', sql.Char(4), idCentroCosto)  
            .input('descripcion', sql.VarChar(30), descripcion)
            .output('success', sql.Bit,0)    
            .execute('crearCentroCosto');

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});



module.exports = router