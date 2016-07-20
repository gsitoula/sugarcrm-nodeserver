'use strict';

var router = require('express').Router();
var jsugar = require('jsugar');
var session = require('express-session');
var config = require('config');
var crypto = require('crypto');


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

    //var sess = req.session.user;

        var username = "admin";
        var password = "admin";

        jsugar.login(config.baseUrl + "/rest.php", username, password, function(error, response) {

        var id = response.data.id;
        
        if(username !== "admin")
            {
                res.status(501).send({err: 1, descripción: "usuario y/o constraseña incorrecto"});
            }
        else
        {
            //req.session.user={usuario:username, fecha: Date.now(), key: id, hashed:hash};
            //console.log(req.session.user);
            //res.status(200).json(req.session.user);
        }
        //var name_value = req.body.name_value;    
        var set_arr = [
                        { "name": 'name', "value": req.body.name_value},
                        { "name": 'description', "value": req.body.description_value },
                        { "name": 'assigned_user_id', "value": 'seed_chris_id' },
                        { "name": 'account_type', "value": 'Customer' },
                        { "name": 'industry', "value": 'Technology' },
                        { "name": 'annual_revenue', "value": '123' },
                        { "name": 'phone_fax', "value": '3234234' },
                        { "name": 'billing_address_street', "value": 'Catamarca2234' },
                        { "name": 'billing_address_street_4', "value": '' },
                        { "name": 'billing_address_city', "value": 'Detroit' },
                        { "name": 'billing_address_state', "value": 'NY' },
                        { "name": 'billing_address_postalcode', "value": '25476' },
                        { "name": 'billing_address_country', "value": 'USA' },
                        { "name": 'rating', "value": 'Good' },
                        { "name": 'phone_office', "value": '(216)-872-9001' },
                        { "name": 'phone_alternate', "value": '' },
                        { "name": 'website', "value": 'www.hardcoretechinc.us' },
                        { "name": 'ownership', "value": '' },
                        { "name": 'employees', "value": '' },
                        { "name": 'ticker_symbol', "value": '' },
                        { "name": 'shipping_address_street', "value": 'Catamarca2234' },
                        { "name": 'shipping_address_street_2', "value": '' },
                        { "name": 'shipping_address_street_3', "value": '' },
                        { "name": 'shipping_address_street_4', "value": '' },
                        { "name": 'shipping_address_city', "value": 'Detroit' },
                        { "name": 'shipping_address_state', "value": 'NY' },
                        { "name": 'shipping_address_postalcode', "value": '25476' },
                        { "name": 'shipping_address_country', "value": 'USA' },
                        { "name": 'email1', "value": 'lala@example.to' },
                        { "name": 'email_addresses_non_primary', "value": '' },
                        { "name": 'parent_id', "value": '' },
                        { "name": 'sic_code', "value": '' },
                        { "name": 'parent_name', "value": '' },
                        { "name": 'email_opt_out', "value": '0' },
                        { "name": 'invalid_email', "value": '0' },
                        { "name": 'email', "value": '' },
                        { "name": 'campaign_id', "value": '' },
                        { "name": 'campaign_name', "value": '' }
                    ]; 

        var params = {
            session: id,
            module_name: "Accounts",
            name_value_list: set_arr
        };

    jsugar.call(config.baseUrl + '/rest.php', 'set_entry', params, function(error, response) {

        var data = response.data;
        res.status(200).json(data);

        });
    });
});

module.exports = router;