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
    
    var msgId =    g.generate({
        length : 3,
        include  : ["upper", "down", "numbers"],
        add : {
          before : "VIA"      
        }
      });

      return msgId
}


router.post('/crearViatico', (req, res) => {
    const idViatico = generateMessageId();
    const factura = req.body.factura;
    const monto = req.body.monto;
    const numPax = req.body.numPax;
    const proveedor = req.body.proveedor;
    const tipoViatico = req.body.tipoViatico;
    const cedula = req.body.cedula;
    const idEvento = req.body.idEvento;
    const placa = !req.body.placa ? null : req.body.placa
    const kilometro = !req.body.placa ? null : req.body.kilometro;
    routePool.connect().then(pool => {
        console.log(req.body);
        return pool.request()
            .input('idViatico', sql.Char(6), idViatico )
            .input('idEvento', sql.Char(6), idEvento )
            .input('factura', sql.Char(4), factura )
            .input('monto', sql.Int, monto )
            .input('numPax', sql.Int, numPax )
            .input('proveedor', sql.Char(6), proveedor )
            .input('tipoViatico', sql.Char(4), tipoViatico )
            .input('cedula', sql.Char(11), cedula )
            .input('placa', sql.Char(6), placa)
            .input('kilometro', sql.Int, kilometro)
            .output('success', sql.Bit,0)
            .execute('crearViaticos'); //Cambiar por el procedure

    }).then(val => {

        routePool.close();
        console.log(val.recordset)
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});






router.get('/getViatico', (req, res) => {
    const idEvento = req.query.idEvento;
    
    routePool.connect().then(pool => {
        return pool.request()
            .output('success', sql.Bit,0)
            .input('idEvento', sql.Char(6), idEvento )
            .execute('getViaticoEvento');

    }).then(val => {

        routePool.close();
        console.log(val.recordset)
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});


router.get('/getTipoViatico', (req, res) => {

    routePool.connect().then(pool => {
        return pool.request()
            .output('success', sql.Bit,0)
            .execute('getTipoViatico');

    }).then(val => {

        routePool.close();
        console.log(val.recordset)
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});

router.get('/getAutos', (req, res) => {

    routePool.connect().then(pool => {
        return pool.request()
            .output('success', sql.Bit,0)
            .execute('getAutos');

    }).then(val => {

        routePool.close();
        console.log(val.recordset)
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});


//Eliminar un viatico
router.delete('/eliminarViatico', (req, res) => {

    const idViatico = req.body.idViatico;

    routePool.connect().then(pool => {
        return pool.request()
            .input('idViatico', sql.Char(6), idViatico)
            .output('success', sql.Bit,0)
            .execute('eliminarViatico'); 

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});





module.exports = router;
