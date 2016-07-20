'use strict';

var router = require('express').Router();
var jsugar = require('jsugar');
var session = require('express-session');
var config = require('config');
var crypto = require('crypto');
var tds = require('tds');

var conn = new tds.Connection({
	host: '192.168.1.246',
	userName: 'srvma',
	password: 'Cardinal2016',
	options: {
		database: 'Northwind',
		tdsVersion: '7.1'
	}
});

conn.connect(function(error) {
	if (error != null) {
		console.error('Received error', error);
	} else {
		coonsole.log('Now connected, can start using');
	}
});


module.exports = router;
