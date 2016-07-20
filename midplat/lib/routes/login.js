'use strict';

var router = require('express').Router();
var jsugar = require('jsugar');
var session = require('express-session');
var config = require('config');
var crypto = require('crypto');

router.post('/login', function(req, res) {

	var username = req.body.username;
	var password = req.body.pass;
	var hash = crypto.createHash('md5').update(password+Date.now()).digest("hex");

	jsugar.login(config.baseUrl + "/rest.php", username, password, function(error, response) {

		var id = response.data.id;
		if(username !== "admin")
			{
				res.status(501).send({err: 1, descripción: "usuario y/o constraseña incorrecto"});
	    	}
	    else
	    {
	    	req.session.user={usuario:username, fecha: Date.now(), key: id, hashed:hash};
	    	console.log(req.session.user);
	    	res.status(200).json(req.session.user);
	    }
	});
});

module.exports = router;
