'use strict';

var http = require('http');
var express = require('express');
var session = require('express-session');
var path   = require('path');
var helmet = require('helmet');
var cors = require('cors');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jsugar = require('jsugar');

var app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());


app.use(bodyParser.urlencoded({
  extended: true,
  limit: '10mb'
}));

// Set Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

var port = process.env.PORT || 3000;

var hora = 3600000;
var dia=hora*24;
app.use(session({
  cookie: {
    maxAge: dia
  },
  secret: '123456',
  resave: false,
  saveUnitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

var url = "http://localhost/SuiteCRM-7.6.4/service/v4_1/rest.php";


app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.pass;

    jsugar.login(url, username, password, function(error, response) {
        
        var id = response.data.id;
        
        if(password !== "admin") 
      {
        res.status(501).send({err: 1, descripción: "usuario y/o password incorrecto"});
      }
        else 
      {
          req.session.user={usuario:username, fecha: Date.now(), key: id};
          res.status(200).json(req.session.user);
          console.log(req.session.user);
      }
    });
});

app.get('/home', function(req, res) {
    
    var sess = req.session.user;
    console.log(sess.key);
    
        var params = {
            session: sess.key,
            module_name: 'Accounts',
            query: '',
            order_by: 'id',
            offset: '0',
            select_fields:['id','name','title'],
            deleted: false
        };
    
    jsugar.call(url, 'get_entry_list', params, function(error, response) {     
        
        var data = response.data;
        res.status(200).json(data);
    });
    
    
    //     if(password !== "admin") 
    //   {
    //     res.status(501).send({err: 1, descripción: "usuario y/o password incorrecto"});
    //   }
    //     else 
    //   {
    //   }

});

app.post('/setAccount', function(req, res) {
  
    var sess = req.session.user;
    
    var params = {
        session: sess.key,
        module_name: 'Accounts',
        name_value_list:[{ "name": "name", "value": "hardcoded"}]
    };

    jsugar.call(url,'set_entry',params,function(error, response) {

        var data = response.data;
        res.status(200).json(data);
    });    

});

    
app.listen(port, function() {
    console.log("funcionando en el puerto: " + port);
});



