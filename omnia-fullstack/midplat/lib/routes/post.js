'use strict';

var router   = require('express').Router();
var jsugar   = require('jsugar');
var session  = require('express-session');
var config   = require('config');
var crypto   = require('crypto');
var jsonfile = require('jsonfile');
var sql      = require('mssql');
var file     = 'config/default.json';

router.post('/setConfig', function(req, res) {
    
    var obj = req.body;
    //var hash = crypto.createHash('md5').update(obj.password+Date.now()).digest("hex");
    //req.body.password = hash;   

    console.log(obj);

    jsonfile.writeFile(file, obj, function (err) {
        if(!err) {
            //console.log("la configuración a sido guardada");
            res.status(200).send({err: 0, descripción: "la configuración a sido guardada"});
        } else {
            console.log(err);
        }
    });


    /*
    jsonfile.readFile(file, function(err, obj) {
        if(!err) {
        res.status(200).send(JSON.stringify(obj));
    } else {
        console.log(err);
    }   
    });
    */
});



// router.post('/setEntry', function(req, res) {
  
//     //var sess = req.session.user;
    
//     var params = {
//         session: sess.key,
//         module_name: 'Accounts',
//         name_value_list:[{ "name": "name", "value": "hardcoded"}]
//     };

//     jsugar.call(config.baseUrl + '/rest.php','set_entry',params,function(error, response) {

//         var data = response.data;
//         res.status(200).json(data.modules);
//     });    

// });

router.post('/setEntry', function(req, res) {
        
        var conn = new sql.Connection(config.dbConfig);
        var req = new sql.Request(conn);

    conn.connect(function(err) {
        if(err) {
            console.log(err);
            return;
        }
        var tDate = Date.now();
        console.log(tDate);
        var insert = "INSERT INTO test(id, username, password, date) VALUES(12, 'gsito', 'trex','" + tDate +  "')";
        req.query(insert, function(err, recordset) {
            if(err) {
            console.log(err);
            return;
        } else {
            //console.log(recordset);
            var data = recordset;
            res.status(200).send(data);
        }
        conn.close();
        }); 
    });
    
});

module.exports = router;