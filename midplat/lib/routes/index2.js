'use strict';

/*  
    if(username !== "admin")
      {
        res.status(501).send({err: 1, descripción: "usuario y/o constraseña incorrecto"});
        }
      else
      {
        //req.session.user={usuario:username, fecha: Date.now(), key: id, hashed:hash};
        //console.log(req.session.user);
        //res.status(200).json(req.session.user);
      } */

  //var sess = req.session.user;

    /*  
    if(username !== "admin")
      {
        res.status(501).send({err: 1, descripción: "usuario y/o constraseña incorrecto"});
        }
      else
      {
        //req.session.user={usuario:username, fecha: Date.now(), key: id, hashed:hash};
        //console.log(req.session.user);
        //res.status(200).json(req.session.user);
      } */

  //var sess = req.session.user;

var router = require('express').Router();
var sugarServices = require('../sugarService');

router.post("/login", function(req, res) {
  sugarServices.login(req.body, function(err, result) {
    if (err) {
      res.send(console.error('upload failed:', err));
      return;
    }

    var stringResponse = JSON.stringify(result);
    req.session.user = JSON.parse(stringResponse);
    res.send(result);
  })
});

router.get("/home", function(req, res) {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }

  res.render("menu.html", {
    session: req.session.user
  });
});

router.get("/contacts", function(req, res) {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }

  res.render("contacts.html", {
    session: req.session.user
  });
});

router.get("/closeSession", function(req, res) {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  else
  {
    req.session.destroy();
    res.redirect("/");
    return;
  }

  res.render("contacts.html", {
    session: req.session.user
  });
});




router.get("/services/:module", function(req, res) {
  var data = {
    user: req.session.user,
    body: req.body,
    module: req.params.module,
  };

  sugarServices.fetchModuleData(data, function(err, result) {
    if (err) {
      res.send(err);
      return;
    }

    res.send(result);
  });
}); 


module.exports = router;