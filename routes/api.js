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

    api.validateKey(key, function(err, rows) {
        if (rows.length === 1) {
            next();
        } else {
            data.message = 'Bad request';
            data.code = 400;
            res.status(data.code).send(JSON.stringify(data));
            return;
        }
    });
}).get(function(req, res, next) {
    var key = req.param('key');
    var data = {};

    api.updateCount(key, function(err, row) {
        if(err) {
            data.message = err.message;
            data.code = 200;
            res.status(data.code).send(JSON.stringify(data));
            return;
        } else {
            next();
        }
    });
}).get(function(req, res) {
    res.set({
        'Cache-Control': 'private, max-age=0, no-cache'
    });
    var data = {};

    api.getArtist(function(err, item) {
        if (err) console.log(err);
        data.artist = item;
        data.code = 200;
        data.message = 'Succes';
        res.status(data.code).send(JSON.stringify(data));
    });
});

router.route('/v1/register').get(function(req, res) {
    res.redirect('/');
}).post(function(req, res, next) {
    if (typeof req.body === 'undefined' ||
            !validateFqdn(req.body.fqdn)) {
        //var err = new Error('Empty or missing FQDN');
        // next(err);
        console.log('Incorrect fqdn: ' + req.body.fqdn);
        res.render('index', {
            message: 'Incorrect FQDN. Try again, if you please.'
        });
        return;
    }
    next();
}).post(function(req, res, next) {
    var fqdn = req.body.fqdn;
    api.fqdnExists(fqdn, function(error, rows) {
        if (rows.length > 0) {
            res.render('index', {
                message: 'Already registered for ' + fqdn + '. Keep on using it!',
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
    data['key'] = api.generateKey(req.body.fqdn, now);
    data['allowed'] = true;
    data['lastrequest'] = now;
    
    api.registerFqdn(data, function(error, row) {
        res.render('index', {
            message: 'Registration complete! Go use the key wisely.',
            key: row.key
        });
    });
});

router.route('/v1/addartist').get(function(req, res) {
    res.redirect('/');
}).post(function(req, res) {
    var name = req.body.artist;
    if (name.length <= 3) {
        res.render('index', {
            message: 'Artist name empty or too short. Not good.'
        });
        return;
    }
    api.addArtist(name, function(err) {
        if (!err) {
            res.render('index', {
                message: 'Artist saved. Good for you!'
            });
        } else {
            res.render('index', {
               message: name + ' is already in database. No need to add again.' 
            });
        }
    });
});

module.exports = router;

var validateFqdn = function(fqdn) {
    return typeof fqdn !== 'undefined' && fqdn.length > 0 && /^(?=.{1,254}$)((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}$/.test(fqdn);
};

module.exports.validateFqdn = validateFqdn;