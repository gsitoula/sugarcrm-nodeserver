'use strict';

var router   = require('express').Router();
var session  = require('express-session');
var parser   = require('body-parser');
var config   = require('config');
var crypto   = require('crypto');
var jsonfile = require('jsonfile');
var sql      = require('mssql');
var file     = 'config/default.json';
var mongoose = require('mongoose');

router.post('/setConfig', function(req, res) {
    
    var obj = req.body;   

    console.log(obj);

    jsonfile.writeFile(file, obj, function (err) {
          if(!err) 
        {
            //console.log("la configuración a sido guardada");
            res.status(200).send({err: 0, descripción: "la configuración a sido guardada"});
        } 
          else 
        {
            console.log(err);
        }
    });
});

router.post('/tipoCobert', function(req, res) {
   
    var coberTip = req.body.cober;
    
          var obj = {};
     obj.coberHog = coberTip.substring(0,2);
     obj.coberVeh = coberTip.substring(2,4);
     obj.coberVia = coberTip.substring(4,6);

    console.log(obj);
    res.status(200).json(obj);
});


router.post('/setDataMultiassistance', function(req, res) {

    var execUrl = req.originalUrl;
    console.log(req.param("token"));
    
    var i_idCamp = req.body.idCamp;      
    var c_cobVeh = req.body.cobVeh;     
    var c_cobHog = req.body.cobHog;     
    var c_cobVia = req.body.cobVia;     
    var d_fecVig = req.body.fecVig;     
    var d_fecVen = req.body.fecVen;
    var s_numPol = req.body.numPol;
    var s_numSec = req.body.numSec;
    var s_apeNom = req.body.apeNom;
    var s_apelli = req.body.apelli;
    var s_nombre = req.body.nombre;
    var s_sexo   = req.body.sexo;
    var d_fecNac = req.body.fecNac;
    var i_docTip = req.body.docTip;
    var s_docNum = req.body.docNum;
    var s_domici = req.body.domici;
    var s_locali = req.body.locali;
    var s_provin = req.body.provin;
    var s_pais   = req.body.pais;
    var s_codPos = req.body.codPos;
    var s_codAr1 = req.body.codAr1;
    var s_telef1 = req.body.telef1;
    var s_codAr2 = req.body.codAr2;
    var s_telef2 = req.body.telef2;
    var s_codArF = req.body.codArF;
    var s_faxNum = req.body.faxNum;
    var s_email1 = req.body.email1;
    var s_email2 = req.body.email2;
    var s_cuit   = req.body.cuit;
    var s_patent = req.body.patent;
    var s_marVeh = req.body.marVeh;
    var s_modelo = req.body.modelo;
    var s_vehCol = req.body.vehCol;
    var s_vehAno = req.body.vehAno;
    var s_numMot = req.body.numMot;
    var i_tipVeh = req.body.tipVeh;
    var c_operat = req.body.operat;
    
    if(req.session.user.token !== req.param("token")){

        res.status(401).send({err: 1, descripcion: "La sesion a expirado / Bad Authenticity Token"});
    } 
    else 
    {
        var conn = new sql.Connection(config.dbConfig);
        var req = new sql.Request(conn);

        conn.connect(function(err) {
            if(err) 
            {
                console.log(err);
                return;
            } 
            else 
            {   
                /* -- Set de Poliza -- */              
                var sAbmPol = "auxiliout.dbo.SetABMPolizaIntegracion";

                var jsonObj = {};

                req.input('idCampana', sql.Int, i_idCamp);
                req.input('coberturavehiculo', sql.NVarChar, c_cobVeh);
                req.input('coberturahogar', sql.NVarChar, c_cobHog);
                req.input('coberturaviajero', sql.NVarChar, c_cobVia);
                req.input('fechadevigencia', sql.NVarChar, d_fecVig); //
                req.input('fechadevencimiento', sql.NVarChar, d_fecVen);
                req.input('nrodepoliza', sql.NVarChar, s_numPol);
                req.input('nrosecuencial', sql.NVarChar, s_numSec);
                req.input('apellidoynombre', sql.NVarChar, s_apeNom);
                req.input('apellido', sql.NVarChar, s_apelli);
                req.input('nombre', sql.NVarChar, s_nombre);
                req.input('sexo', sql.NVarChar, s_sexo);
                req.input('fechadenacimiento', sql.NVarChar, d_fecNac);
                req.input('idtipodedocumento', sql.Int, i_docTip);
                req.input('numerodedocumento', sql.NVarChar, s_docNum);
                req.input('domicilio', sql.NVarChar, s_domici);
                req.input('localidad', sql.NVarChar, s_locali);
                req.input('provincia', sql.NVarChar, s_provin);
                req.input('pais', sql.NVarChar, s_pais);
                req.input('codigopostal', sql.NVarChar, s_codPos);
                req.input('codigodearea1', sql.NVarChar, s_codAr1);
                req.input('telefono1', sql.NVarChar, s_telef1);
                req.input('codigodearea2', sql.NVarChar, s_codAr2);
                req.input('telefono2', sql.NVarChar, s_telef2);
                req.input('codigodeareafax', sql.NVarChar, s_codArF);
                req.input('fax', sql.NVarChar, s_faxNum);
                req.input('email1', sql.NVarChar, s_email1);
                req.input('email2', sql.NVarChar, s_email2);
                req.input('cuit', sql.NVarChar, s_cuit);
                req.input('patente', sql.NVarChar, s_patent);
                req.input('marcadevehiculo', sql.NVarChar, s_marVeh);
                req.input('modelo', sql.NVarChar, s_modelo);
                req.input('color', sql.NVarChar, s_vehCol);
                req.input('Ano', sql.NVarChar, s_vehAno);
                req.input('NRODEMOTOR', sql.NVarChar, s_numMot);
                req.input('TIPODEVEHICULO', sql.Int, i_tipVeh);
                req.input('Operacion', sql.NVarChar, c_operat);
                
                req.execute(sAbmPol, function(err, recordsets, returnValue, affected) {
                    if(err) 
                    {   
                        console.log(err);
                        res.status(501).json(err);
                        return;
                    } 
                    else 
                    {
                        console.log(recordsets);
                        console.log(affected);
                        console.log(returnValue);
                        
                        /*
                        var aResult=[];
                        var strResult="";
                        var idCanal=recordsets[0].codigoDeCanal;
                        var idTipo=recordsets[0].TipoDeCobertura;
                        var auxCurrent=recordsets[0];
                        recordsets.forEach(function(currentValue)
                        {
                            if(idCanal == currentValue.codigoDeCanal && idTipo==currentValue.TipoDeCobertura)
                            {
                                strResult+=currentValue.TipoDeCobertura;
                                auxCurrent.TipoDeCobertura=strResult;
                            }
                            else
                            {
                                delete auxCurrent.Aplicación;
                                auxCurrent.TipoDeCobertura=strResult;
                                aResult.push(auxCurrent);
                                auxCurrent=currentValue;
                                idCanal=currentValue.codigoDeCanal;
                                idTipo=currentValue.TipoDeCobertura;
                                strResult=currentValue.TipoDeCobertura;
                                delete auxCurrent.Aplicación;
                            }   
                        });

                        aResult.push(auxCurrent);
                        jsonObj.cober_disp = aResult;
                        res.status(200).send( jsonObj );*/
                        /*
                        if(jsonObj) 
                        {
                            var interfaces = os.networkInterfaces();
                            var addresses = [];
                            for (var k in interfaces) {
                                for (var k2 in interfaces[k]) {
                                    var address = interfaces[k][k2];
                                    if (address.family === 'IPv4' && !address.internal) {
                                        addresses.push(address.address);
                                    }
                                }
                            }
                            */
                            //console.log(addresses[0] + " ha ejecutado el Procedimiento");
                            /*
                            var db = mongoose.connection;

                            var dateNow = new Date().toJSON().slice(0,10);*/
                            //var hourNow  = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/,"$1");
                            /*
                            var log_2 = new Log({name: 'Log', date: dateNow, hour: hourNow, state: execUrl, ip: addresses[0]});

                            res.status(200).send(log_2.data);

                            var promise = log_2.save();
                            assert.ok(promise instanceof require('mpromise'));

                            promise.then(function (doc) {
                            assert.equal(doc.name, "Logs");
                            });
                        }*/
                                   
                    }
                    conn.close();
                }); 
            }
        }); 
    }   
});

module.exports = router;