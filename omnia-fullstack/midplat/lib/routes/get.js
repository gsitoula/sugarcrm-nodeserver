'use strict';

var router = require('express').Router();
var jsugar = require('jsugar');
var session = require('express-session');
var crypto = require('crypto');
var sql = require('mssql');
var jsonfile = require('jsonfile');
var config = require('config');
var file = 'config/default.json';

router.get('/getConfig', function(req, res) {

	jsonfile.readFile(file, function(err, obj) {
		if(!err) {
		res.status(200).send(JSON.stringify(obj));
	} else {
		console.log(err);
	}	
	});
});

router.get('/getTable', function(req, res) {

	var conn = new sql.Connection(config.dbConfig);
	var req = new sql.Request(conn);

	conn.connect(function(err) {
		if(err) {
			console.log(err);
			return;
		}
		req.query("EXEC Northwind.dbo.CustOrderHist @CustomerID = 'VINET'", function(err, recordset) {
			if(err) {
			console.log(err);
			return;
		} else {
			var data = recordset;
			res.status(200).send(data);
		}
		conn.close();
		}); 
	});
});

router.get('/getProcedure', function(req, res) {

	var conn = new sql.Connection(config.dbConfig);
	var req = new sql.Request(conn);

	conn.connect(function(err) {
		if(err) {
			console.log(err);
			return;
		}
		req.query("EXEC Northwind.dbo.CustOrderHist @CustomerID = 'VINET'", function(err, recordset, returnValue, affected) {
			if(err) {
			console.log(err);
			return;
		} else {
			var data = recordset;
			res.status(200).send(data);
		}
		conn.close();
		}); 
	});	
});



module.exports = router;
