const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sql = require('mssql');
const conn = require('../dbconn');
const routePool = new sql.ConnectionPool(conn);
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
var HttpStatus = require('http-status-codes');



router.get('/getRecurso', (req, res) => {
    routePool.connect().then(pool => {
        return pool.request()
            .input('isActive', sql.Int, req.query.isActive)
            .execute('getRecurso');

    }).then(val => {

        routePool.close();
        console.log(val.recordset)
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});

//Actualizar Recurso
router.put('/actualizarRecurso', (req, res) => {

    const cedula = req.body.cedula;
    const nombre = req.body.nombre;
    const apellido1 = req.body.apellido1;
    const apellido2 = req.body.apellido2;
    const estado = req.body.estado;

    routePool.connect().then(pool => {
        return pool.request()
            .input('cedula', sql.Char(11), cedula)
            .input('nombre', sql.VarChar(30), nombre)
            .input('apellido1', sql.VarChar(15), apellido1)
            .input('apellido2', sql.VarChar(15), apellido2)
            .input('estado', sql.Bit, estado)
            .output('success', sql.Bit,0)
            .execute('actualizarRecurso'); 

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});

//Se crea un recurso
router.post('/agregarRecurso', (req, res) => {

    const cedula = req.body.cedula;
    const nombre = req.body.nombre;
    const apellido1 = req.body.apellido1;
    const apellido2 = req.body.apellido2;

    routePool.connect().then(pool => {
        return pool.request()
            .input('cedula', sql.Char(11), cedula)  
            .input('nombre', sql.VarChar(30), nombre)
            .input('apellido1', sql.VarChar(15), apellido1)
            .input('apellido2', sql.VarChar(15), apellido2)
            .output('success', sql.Bit,0)    
            .execute('crearRecurso');

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(val.recordset);

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });

    });
});







module.exports = router;
