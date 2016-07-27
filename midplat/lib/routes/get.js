'use strict';

var router = require('express').Router();
var jsugar = require('jsugar');
var session = require('express-session');
//var config = require('config');
var crypto = require('crypto');
var sql = require('mssql');
var jsonfile = require('jsonfile');
var file = 'config/config.json';

router.get('/getConfig', function(req, res) {

	jsonfile.readFile(file, function(err, obj) {
		if(!err) {
		res.status(200).send(JSON.stringify(obj));
	} else {
		console.log(err);
	}	
	});
});

var dbConfig = {
	server: "192.168.0.11", //\\ANARKIA\\MSEXP",
	database: "adventure",
	user: "deb03",
	password: "deb",
	port: "1029"
};

router.get('/getTable', function(req, res) {
	var conn = new sql.Connection(dbConfig);
	var req = new sql.Request(conn);

	conn.connect(function(err) {
		if(err) {
			console.log(err);
			return;
		}
		req.query("SELECT * FROM lala", function(err, recordset) {
			if(err) {
			console.log(err);
			return;
		} else {
			console.log(recordset);
		}
		conn.close();	
		}); 
	});
});


/*
var connection = new sql.Connection({
	user: 'deb03',
password: 'deb',
server  : '192.168.0.11',
    port: '1029',   
database: 'adventure'
});
var request = new sql.Request("mssql://deb03:deb@192.168.0.11:1029/adventure");


connection.connect(function(err) {
	if(!err) {
		console.log('everything is fine');
		new sql.Request().query('select * from ', function(err, recordset) {
			console.log(recordset);
		})	
	} else {
		console.log(err);
	}
});
*/

module.exports = router;
