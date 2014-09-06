var express = require('express');
var router = express.Router();
var api = require('../lib/artist-api.js');

router.route('/').all(function(req, res) {
    res.redirect('/');
});

router.route('/v1').all(function(req, res) {
    res.redirect('/');
});

router.route('/v1/getartist').get(function(req, res, next) {
    var key = req.param('key');
    var data = {};

    req.db.accounts.find({ 'key': key }).toArray(function(error, rows) {
        if (rows.length === 1) {
            next();
        } else {
            data.message = 'Bad request';
            data.code = 400;
            res.send(data.code, JSON.stringify(data));
        }
    });
}).get(function(req, res) {
    res.set({
        'Cache-Control': 'private, max-age=0, no-cache'
    });
    var data = {};

    api.getArtist(req, function(err, item) {
        if (err) console.log(err);
        data.artist = item;
        data.code = 200;
        data.message = 'Succes';
        res.send(data.code, JSON.stringify(data));
    });
});

router.route('/v1/register').get(function(req, res) {
    res.redirect('/');
}).post(function(req, res, next) {
    if (typeof req.body === 'undefined' ||
            typeof req.body.fqdn === 'undefined' ||
            req.body.fqdn.length === 0) {
        var err = new Error('Empty or missing FQDN');
        next(err);
    }
    next();
}).post(function(req, res, next) {
    var fqdn = req.body.fqdn;
    req.db.accounts.find({ 'fqdn': fqdn }).toArray(function(error, rows) {
        if (rows.length > 0) {
            res.render('index', {
                title: 'R.A.A.C.',
                message: 'Already registered',
                key: rows[0].key
            });
        } else {
            next();
        }
    });
}).post(function(req, res) {
    var now = Date.now();
    var data = {};
    data['fqdn'] = req.body.fqdn;
    data['registered'] = now;
    data['requests'] = 0;
    data['key'] = api.getKey(req.body.fqdn, now);
    data['allowed'] = true;

    req.db.accounts.save(data, function(error, row) {
        res.render('index', {
            title: 'R.A.A.C.',
            message: 'Registered!',
            key: row.key
        });
    });    
});

router.route('/v1/addartist').get(function(req, res) {
    res.redirect('/');
}).post(function(req, res) {
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
