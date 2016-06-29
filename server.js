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

var url = "http://localhost/SugarCE-Full-6.5.23/service/v4_1/rest.php";

/*
    --SugarCRM wrappeado en NodeJs--

    NodeJs realizara el trabajo de mediador entre
    nuestra vista (la pagina web) y SugarCRM. Para esto
    utilizamos el modulo jsugar y sus funciones jsugar.call
    que utilizar los Methods Calls como parametro principal
    para realizar la tarea deseada.
    Para este caso estamos usando la versión 6.5.23 de SugarCRM,
    también conocida como Community Edition.
*/


/* 
    Comenzamos con el login necesario para que 
    SugarCRM nos deje realizar las tareas deseadas.
    Usando Express pegamos a una URL llamada login y
    pedimos los datos necesarios al usuario para
    loguearnos. El id de la sesión nos lo da Sugar y
    sera necesario para realizar todas las llamadas
    de metodos que desemos realizar, este mismo sera
    guardado como una propiedad de nuestro express-session
    object para luego poder utilizarla mas adelante.
*/

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

/*
    A partir de este punto estaremos realizando cada una de las
    Method Calls que SugarCRM nos brinda. El orden es el mismo
    que podemos observar en la documentación del CRM elegido.
*/


app.get('/modulesAvailable', function(req, res) {
    /*
        este es nuestro primer SugarCRM Method Call.
        Observen como utilizando express-session conseguimos
        el id que Sugar nos dio en el momento de hacer login  
    */
    var sess = req.session.user;

        var params = {
          session: sess.key,
          filter: 'default',
        }; 
    
    jsugar.call(url, 'get_available_modules', params, function(error, response) {

        var data = response.data;
        res.status(200).json(data);
    });
});

// --------------------------------------------
app.get('/documentRevision', function(req, res) {});

// --------------------------------------------
app.get('/entries', function(req, res) {});

// --------------------------------------------
app.get('/entriesCount', function(req, res) {});

// --------------------------------------------
app.get('/documentRevision', function(req, res) {});

// --------------------------------------------
app.get('/entry', function(req, res) {});


app.get('/entryList', function(req, res) {
    
    var sess = req.session.user;
    console.log(sess.key);
    
        var params = {
            session: sess.key,
            module_name: 'Accounts',
            query: '',
            order_by: 'id',
            offset: '0',
            select_fields:['id','name','title'],
            deleted: false,
            favorites: false,
        };
    
    jsugar.call(url, 'get_entry_list', params, function(error, response) {     
        
        var data = response.data;
        res.status(200).json(data);
    });
});

// --------------------------------------------
app.get('/language', function(req, res) {});

// --------------------------------------------
app.get('/lastViewed', function(req, res) {});

// --------------------------------------------
app.get('/modifiedRel', function(req, res) {});

app.get('/modulesFields', function(req, res) {

    var sess = req.session.user;

        var params = {
          session: sess.key,
          module_name: 'Accounts',
          fields: [],
        }; 
    
    jsugar.call(url, 'get_module_fields', params, function(error, response) {

        var data = response.data;
        res.status(200).json(data);
    });
});

// --------------------------------------------
app.get('/modulesFieldsMd5', function(req, res) {});


app.get('/modulesLayout', function(req, res) {

    var sess = req.session.user;

        var params = {
          session: sess.key,
          module_name: 'Accounts',
          types: ["default"],
          views: ["edit"],
          acl_check: false,
          md5: true,
        }; 
    
    jsugar.call(url, 'get_module_layout', params, function(error, response) {

        var data = response.data;
        res.status(200).json(data);
    });
});

// --------------------------------------------
app.get('/modulesLayoutMd5', function(req, res) {});    

// --------------------------------------------
app.get('/noteAttachment', function(req, res) {});

// --------------------------------------------
app.get('/quotesPDF', function(req, res) {});

// --------------------------------------------
app.get('/relationships', function(req, res) {});

// --------------------------------------------
app.get('/reportEntries', function(req, res) {});

// --------------------------------------------
app.get('/reportPDF', function(req, res) {});

// --------------------------------------------
app.get('/serverInfo', function(req, res) {});

// --------------------------------------------
app.get('/upcomingActivities', function(req, res) {});

// --------------------------------------------
app.get('/userId', function(req, res) {});

// --------------------------------------------
app.get('/teamId', function(req, res) {});

// --------------------------------------------
app.get('/queueCycle', function(req, res) {});

// --------------------------------------------
app.get('/queueNext', function(req, res) {});

// --------------------------------------------
app.get('/queueRun', function(req, res) {});

// --------------------------------------------
app.get('/oauthAccess', function(req, res) {});

// --------------------------------------------
app.get('/seamlessLogin', function(req, res) {});

// --------------------------------------------
app.get('/searchByModule', function(req, res) {});

// --------------------------------------------
app.get('/campaignMerge', function(req, res) {});

// --------------------------------------------
app.get('/documentRevision', function(req, res) {});

// --------------------------------------------
app.post('/setEntries', function(req, res) {});


app.post('/setEntry', function(req, res) {
  
    var sess = req.session.user;
    
    var params = {
        session: sess.key,
        module_name: 'Accounts',
        name_value_list:[{ "name": "name", "value": "hardcoded"}]
    };

    jsugar.call(url,'set_entry',params,function(error, response) {

        var data = response.data;
        res.status(200).json(data.modules);
    });    

});

// --------------------------------------------
app.post('/setNote', function(req, res) {});

// --------------------------------------------
app.post('/setRelationship', function(req, res) {});

// --------------------------------------------
app.post('/setRelationships', function(req, res) {});

// --------------------------------------------
app.post('/snipImportEmails', function(req, res) {});

// --------------------------------------------
app.post('/snipUpdateContacts', function(req, res) {});

    
app.listen(port, function() {
    console.log("funcionando en el puerto: " + port);
});



