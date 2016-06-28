//var username = "admin";
//var password = "admin";

app.post('/login', function(req, res) {
  var username = req.body.user;
  var password = req.body.pass;
  console.log(username);
  console.log(password);

  jsugar.login(url, username, password, function(err, res) {
      var id = res.data.id;
      // Retrieve the number of Accounts
      var params = {
        session: id,
        module_name: 'Accounts',
        query: '',
        deleted: false
      };
   
      jsugar.call(url, 'get_entries_count', params, function(error, res) {
        // the server returns:
        // response = { data: { result_count: '561' } }
        var data = res.data;
        console.log(data);
   });      
      // Close the session:
      jsugar.logout(url, id);
  });  
});

app.get('/accounts', function(req, res) {
});

//app.post('/postAlgo', function(req, res) {});

// jsugar.getServerInfo(url, function(error, res) {
//    console.log(res);
// });

// sugar.init(
//   {
//     apiURL: "http://localhost/SugarCE-Full-6.5.23/service/v4_1/rest.php",
//     login: "admin",
//     passwd: "admin"
//   }
// );

// console.log(sugar.configInfo());
//
// app.get('/', function(req, res) {
//     res.render('index');
// });
//
// app.post('/postLogin', function(req, res) {
//
//     sugar.login(function(sessionID){
//         if(sessionID != 'undefined') {
//             //add your query here
//             var s_name = req.body.name;
//             var s_value = req.body.value;
//             var params = {
//                                  session:  sessionID,
//                                  module_name : "Accounts",
//                                  name_value_list : [
//                                                     { "name":  "namess",  "value": "Account from Node-SugarCRM-Client" }
//                                                     ]
//                              };
//                     sugar.call("set_entry", params, function(res,err){
//                         if(err) {
//                           console.dir(err);
//                          }  //else {
//                         //   console.dir(res);
//                         // }
//                     });
//
//
//       } else {
//         console.log("check your privileges");
//       }
//     });
// });