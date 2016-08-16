'use strict';

var router  = require('express').Router();
var session = require('express-session');
var crypto  = require('crypto');
var actDir  = require('activedirectory');
var config  = require('config');

var configAD = 
               { 
                     url: 'ldap://' + config.adUrl,
                  baseDN: 'dc=' + config.dcd + ',dc=' + config.dce,
                username: "Administrador@jsol.local",//config.dbConfig.user + '@' + config.dbConfig.domain,
                password: "Jsol3001"//config.dbConfig.password 
               };

var ad = new actDir(configAD);


router.post('/logon', function(req, res) {
    
    var username   = req.body.username + "@" +config.dbConfig.domain;  
    var pass       = req.body.password;
    var hash       = crypto.createHash('md5').update(username+Date.now()).digest('hex');

    ad.authenticate(username, pass, function(err, auth) {
          
          if(err) 
        {   
            if(err.code){   
            //console.log('ERROR: ' + JSON.stringify(err));
            res.status(501).send({err: err.name,mensaje: err.message,descripcion: "usuario y/o contraseña incorrecto"});
            return;
          }  
        } 
          else 
        {
          if(auth) 
        {
            //console.log('User name: ' + username + ' has authenticated correctly');
            //req.session.user = {usuario: username, fecha: new Date(), key: hash, auth: auth};
            req.session.user = {token: hash};
            res.status(200).json(req.session.user);
        } 
          else 
        {
            console.log('Authentication failed for user: ' + username);
            res.status(501).send({error: 1, descripcion: "Un error ha ocurrido durante la Autenticacion con el servidor"});
        }
      }
    });
});


module.exports = router;
