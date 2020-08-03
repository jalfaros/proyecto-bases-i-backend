//Dependencias=========================================
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// ====================================================
if (!process.env.SECRET) process.env.SECRET = 'supersecret';
// ====================================================


//Morgan (desconocido)=================================
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Middleware===========================================

//CORS - Mejorar middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


const cCostoController = require('./routes/Controllers/CentroCostoController')
const motivoController = require('./routes/Controllers/MotivoController')
const recursoController = require('./routes/Controllers/RecursoController')
const sucursalController = require('./routes/Controllers/SucursalController')
const laborController = require('./routes/Controllers/LaborController')
const eventoController = require('./routes/Controllers/EventoController')
const viaticoController = require('./routes/Controllers/ViaticoController')
const proveedorController = require('./routes/Controllers/ProveedorController')
const clienteController = require('./routes/Controllers/ClienteController')


app.use('/costo', cCostoController)
app.use('/motivo', motivoController)
app.use('/recurso', recursoController)
app.use('/sucursal', sucursalController)
app.use('/labor', laborController)
app.use('/evento', eventoController)
app.use('/viatico', viaticoController)
app.use('/proveedor', proveedorController)
app.use('/cliente', clienteController)





//NOT FOUND
app.use((req, res) => {
    res.sendStatus(404);
});

//ERROR
app.use((err, req, res) => {
    res.status(err.status || 500)
        .json({ error: { message: err.message } });
});

module.exports = app;
