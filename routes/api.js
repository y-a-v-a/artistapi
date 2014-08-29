var express = require('express');
var router = express.Router();
var api = require('../lib/artist-api.js');

router.get('/', function(req, res) {
    res.redirect('/');
});

router.get('/register', function(req, res) {
    res.redirect('/');
});

router.get('/v1/addartist', function(req, res) {
    res.redirect('/');
});

router.get('/v1/getartist', function(req, res) {
    res.set({
        'Cache-Control': 'private, max-age=0, no-cache'
    });
    var key = req.param('key');
    var data = {};

    req.db.accounts.find({ 'key': key }).toArray(function(error, rows) {
        if (rows.length === 1) {
            api.getArtist(req, function(err, item) {
                if (err) console.log(err);
                data.artist = item;
                data.code = 200;
                data.message = 'Succes';
                res.send(data.code, JSON.stringify(data));
            });
        } else {
            data.message = 'Bad request';
            data.code = 400;
            res.send(data.code, JSON.stringify(data));
        }
    });
});

router.post('/register', function(req, res) {
    var now = Date.now();
    var data = {};
    var fqdn = req.body.fqdn
    data['fqdn'] = fqdn;
    data['registered'] = now;
    data['requests'] = 0;
    data['key'] = api.getKey(req.body.fqdn, now);
    data['allowed'] = true;
    
    req.db.accounts.find({ 'fqdn': fqdn }).toArray(function(error, rows) {
        if (rows.length > 0) {
            res.render('index', {
                title: 'R.A.A.C.',
                message: 'Already registered',
                key: rows[0].key
            });
        } else {
            req.db.accounts.save(data, function(error, row) {
                res.render('index', {
                    title: 'R.A.A.C.',
                    message: 'Registered!',
                    key: row.key
                });
            });
        }
    });
});

router.post('/v1/addartist', function(req, res) {
    var name = req.body.artist;
    api.addArtist(req, name, function(err) {
        if (!err) {
            res.render('index', {
                title: 'R.A.A.C.',
                message: 'Artist saved'
            });
        }
    });
});

module.exports = router;
