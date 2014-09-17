var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {
      message: 'Welcome to the one and only free Artist REST Service'
  });
});

module.exports = router;
