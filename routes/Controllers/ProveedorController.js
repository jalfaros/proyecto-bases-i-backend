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
        include  : ["upper", "numbers","upper"],
        add : {
          before : "PRO"      
        }
      });

      return msgId
}

//Obteniendo Centros de costo
router.get('/getProovedor', (req, res) => {

    routePool.connect().then(pool => {
        return pool.request()
            .input ('isActive', sql.Int, req.query.isActive)
            .output('success', sql.Bit,0)
            .execute('getProveedor');

    }).then(val => {

        routePool.close();
        console.log(val.recordset)
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});

//Actualizar Proveedor
router.put('/actualizarProveedor', (req, res) => {

    const idProveedor = req.body.idProveedor;
    const descripcion = req.body.descripcion;
    const estado = req.body.estado;

    routePool.connect().then(pool => {
        return pool.request()
            .input('estado', sql.Bit, estado)
            .input('descripcion', sql.VarChar(30), descripcion)
            .input('idProveedor', sql.Char(6), idProveedor)
            .output('success', sql.Bit,0)
            .execute('actualizarProveedor'); 

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});

//Se crea un Proveedor
router.post('/agregarProveedor', (req, res) => {

    const idProveedor = generateMessageId()
    const descripcion = req.body.descripcion;

    routePool.connect().then(pool => {
        return pool.request()
            .input('idProveedor', sql.Char(6), idProveedor)  
            .input('descripcion', sql.VarChar(30), descripcion)
            .output('success', sql.Bit,0)    
            .execute('crearProvedor');

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});

module.exports = router;