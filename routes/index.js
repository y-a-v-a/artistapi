var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
      title: 'R.A.A.C.',
      message: 'Welcome to the one and only REST Artist API client'
  });
});

module.exports = router;
