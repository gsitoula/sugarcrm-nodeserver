'use strict';

var async = require('async');
var request = require('request');
var config = require('config');
var crypto = require("crypto");
var mapDataSchema = require('./sugarMap');

function login(requestData, callback) {
  var hash = crypto.createHash('md5').update(requestData.password).digest("hex");
  var reqBody = {
    'method': 'login',
    'input_type': 'JSON',
    'response_type': 'JSON',
    'rest_data': JSON.stringify({
      'user_auth': {
        'user_name': requestData.user_name,
        'password': hash
      }
    })
  };

  var opts = {
    url: config.baseUrl + '/rest.php',
    method: 'POST',
    //auth: { user: 'username', password: 'password' },
    json: true,
    form: reqBody
  };

  request.post(opts, function(err, httpResponse, res) {
    if (err) {
      callback(err, null);
      return;
    }
    
    console.log(JSON.stringify(res));
    callback(null, res);
  });
}

function fetchModuleData(requestData, finishCallback) {
  async.waterfall([
    function(callback) {
      getModuleSchema(requestData, function(err, res){
        if(err){
          callback(err);
          return;
        }

        callback(null, res);
      });
    },
    function(schema, callback) {
      getModuleData(requestData, function(err, res){
        if(err){
          callback(err);
          return;
        }

        var config = {
          data: res,
          schema: schema
        }

        callback(null, config);
      });
    }
  ], function(err, config) {
    var finalData = mapDataSchema(config);
    finishCallback(null, finalData);
  });
}

function getModuleSchema(dataConfig, callback) {
  var reqData = {
    "method": "get_module_fields",
    "input_type": "JSON",
    "response_type": "JSON",

    "rest_data": JSON.stringify({
      "session": dataConfig.user.id,
      "module_name": dataConfig.module,
      "fields": dataConfig.body.fields || []
    })
  };

  var opts = {
    url: config.baseUrl + '/rest.php',
    method: 'POST',
    //auth: { user: 'username', password: 'password' },
    json: true,
    form: reqData
  };

  request.post(opts, function(err, response, body) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, body)
  });
}

function getModuleData(dataConfig, callback) {
  var reqData = {
    "method": "get_entry_list",
    "input_type": "JSON",
    "response_type": "JSON",

    "rest_data": JSON.stringify({
      "session": dataConfig.user.id,
      "module_name": dataConfig.module,
      "query": "",
      "order_by": "",
      "offset": "",
      "select_fields": dataConfig.body.fields || []
    })
  };

  var opts = {
    url: config.baseUrl + '/rest.php',
    method: 'POST',
    //auth: { user: 'username', password: 'password' },
    json: true,
    form: reqData
  };

  request.post(opts, function(err, response, body) {
    if (err) {
      callback(err);
      return;
    }
    
    callback(null, body);
  });
}

module.exports = {
  login: login,
  fetchModuleData: fetchModuleData
};