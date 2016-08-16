'use strict';

var router   = require('express').Router();
var session  = require('express-session');
var crypto   = require('crypto');
var sql      = require('mssql');
var jsonfile = require('jsonfile');
var config   = require('config');
var file     = 'config/default.json';
var mongoose = require('mongoose');
var os       = require('os');
var assert   = require('assert');


mongoose.connect('mongodb://localhost/local');

/* -- Get del config.json -- */
router.get('/getConfig', function(req, res) {

	jsonfile.readFile(file, function(err, obj) {
		if(!err) {
			res.status(200).send(JSON.stringify(obj));
		} else {
			console.log(err);
		}	
	});
});

/* -- LOGS -- */
var logSchema = mongoose.Schema({
	 name: String,
	 date: String,
	 hour: String,
	state: String,
	  ip : String 
});

var Log = mongoose.model('Log', logSchema);    

router.get('/getLogs', function(req, res) {
	
	var db = mongoose.connection;

	
	function find (collec, query, callback) {
		mongoose.connection.db.collection(collec, function(err, collection) {
			collection.find(query).toArray(callback);
		});
	};

	find('logs', {name:"Log"}, function(err, docs) {
		//console.dir(docs);
		res.status(200).send(docs);
	});
});

/* --- Trae data desde los Stored Procedures --- */
router.get('/getDataMultiassistance', function(req, res) {

	//console.log(session.touch());
	//console.log(req.originalUrl);
	var execUrl = req.originalUrl;
	console.log(req.param("token"));
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
				/* tipo de Documento*/
				var gtDoc = "EXEC auxiliout.dbo.GetTiposDeDocumentos";
				/* tipo de Vehiculo */
				var gtVeh = "EXEC auxiliout.dbo.GetTiposDeVehiculos";
				/* Coberturas Disponibles */
				var gcDis = "EXEC auxiliout.dbo.GetCoberturasDisponibles 'cardinalmultiassistance.com'";

				var jsonObj = {};

				req.query(gtDoc, function(err, recordsets, returnValue, affected) {
					if(err) 
					{
						console.log(err);
						return;
					} 
					else 
					{	
						var data = returnValue.toString();				
						jsonObj.tipo_Documento = recordsets;	
					}
					conn.close();
				});

				req.query(gtVeh, function(err, recordsets, returnValue, affected) {
					if(err) 
					{
						console.log(err);
						return;
					} 
					else 
					{	
						var data = returnValue.toString();
						jsonObj.tipo_Vehiculo = recordsets;			
					}
					conn.close();
				});

				req.query(gcDis, function(err, recordsets, returnValue, affected) {
					if(err) 
					{
						console.log(err);
						return;
					} 
					else 
					{
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
						res.status(200).send( jsonObj );

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
							
							//console.log(addresses[0] + " ha ejecutado el Procedimiento");

							var db = mongoose.connection;

							var dateNow = new Date().toJSON().slice(0,10);
							var hourNow  = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/,"$1");

							var log_2 = new Log({name: 'Log', date: dateNow, hour: hourNow, state: execUrl, ip: addresses[0]});

							res.status(200).send(log_2.data);

							var promise = log_2.save();
							assert.ok(promise instanceof require('mpromise'));

							promise.then(function (doc) {
							assert.equal(doc.name, "Logs");
							});
						}			
					}
					conn.close();
				}); 
			}
		}); 
	}	
});

module.exports = router;
