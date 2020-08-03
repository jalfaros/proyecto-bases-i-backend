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
        length : 7,
        include  : ["upper", "numbers","upper"],
        add : {
          before : "CL"      
        }
      });

      return msgId
}



router.get('/getCliente', (req, res) => {
    const idEvento = req.query.idEvento;
    
    routePool.connect().then(pool => {
        return pool.request()
            .input('isActive', sql.Int, req.query.isActive)
            .output('success', sql.Bit,0)
            .execute('getCliente'); 

    }).then(val => {

        routePool.close();
        console.log(val.recordset)
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});



//Actualizar Cliente
router.put('/actualizarCliente', (req, res) => {

    const idCliente = req.body.idCliente;
    const descripcion = req.body.descripcion;
    const estado = req.body.estado;

    routePool.connect().then(pool => {
        return pool.request()
            .input('estado', sql.Bit, estado)
            .input('descripcion', sql.VarChar(30), descripcion)
            .input('idCliente', sql.Char(9), idCliente)
            .output('success', sql.Bit,0)
            .execute('actualizarCliente'); 

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});


//Se crea un Cliente
router.post('/agregarCliente', (req, res) => {

    const idCliente = generateMessageId()
    const descripcion = req.body.descripcion;

    routePool.connect().then(pool => {
        return pool.request()
            .input('idCliente', sql.Char(9), idCliente)  
            .input('descripcion', sql.VarChar(30), descripcion)
            .output('success', sql.Bit,0)    
            .execute('crearCliente');

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});




module.exports = router;