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
          before : "SC"      
        }
      });

      return msgId
}


//Me obtiene todas las sucursales

router.get('/getSucursal', (req, res) => {
    routePool.connect().then(pool => {
        return pool.request()
            .execute('getSucursales');

    }).then(val => {

        routePool.close();
        console.log(val.recordset)
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});

//Me obtiene las sucursales con la descripción del cliente

router.get('/getSucursalClientes', (req, res) => {
    routePool.connect().then(pool => {
        return pool.request()
            .output('success', sql.Bit,0)
            .execute('getSucursal');

    }).then(val => {

        routePool.close();
        console.log(val.recordset)
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });


});

//Actualizar Sucursal
router.put('/actualizarSucursal', (req, res) => {

    const idSucursal = req.body.idSucursal;
    const descripcion = req.body.descripcion;
    const estado = req.body.estado;

    routePool.connect().then(pool => {
        return pool.request()
            .input('estado', sql.Bit, estado)
            .input('descripcion', sql.VarChar(70), descripcion)
            .input('idSucursal', sql.Char(4), idSucursal)
            .output('success', sql.Bit,0)
            .execute('actualizarSucursal'); 

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});

//Se crea una sucursal
router.post('/agregarSucursal', (req, res) => {

    const idSucursal = generateMessageId()
    const idCliente = req.body.idCliente;
    const descripcion = req.body.descripcion;

    routePool.connect().then(pool => {
        return pool.request()
            .input('idSucursal', sql.Char(4), idSucursal)  
            .input('idCliente', sql.Char(9), idCliente) 
            .input('descripcion', sql.VarChar(70), descripcion)
            .output('success', sql.Bit,0)    
            .execute('crearSucursal');

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});

router.get('/getRecursoActivo', (req, res) => {
    routePool.connect().then(pool => {
        return pool.request()
            .output('success', sql.Bit, 0)
            .execute('getSucursalCliente');

    }).then(val => {

        routePool.close();
        console.log(val.recordset)
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});







module.exports = router;
