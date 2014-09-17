var crypto = require('crypto');
var mongoskin = require('mongoskin');

var mongodb = mongoskin.db('mongodb://localhost:27017/artistapi?auto_reconnect', { safe: true });

var db = {};
db.artists = mongodb.collection('artists');
db.accounts = mongodb.collection('accounts');

exports.validateKey = function(key, callback) {
    db.accounts.find({ 'key': key }).toArray(function(err, rows) {
        callback(err, rows);
    });
};

exports.registerFqdn = function(data, callback) {
    db.accounts.save(data, function(err, row) {
        callback(err, row);
    });
};

exports.fqdnExists = function(fqdn, callback) {
    db.accounts.find({ 'fqdn': fqdn }).toArray(function(err, rows) {
        callback(err, rows);
    });
};

exports.generateKey = function(fqdn, now) {
    var str = fqdn + now;
    return crypto
        .createHash('sha256')
        .update(str)
        .digest('hex');
};

exports.getArtist = function(callback) {
    var count = 0;
    var rand = null;
    db.artists.find().toArray(function(err, rows) {
        count = rows.length;
        rand = function(){
            return Math.floor( Math.random() * count );
        };
        db.artists.find().limit(-1).skip(rand()).toArray(function(err, rows) {
            if (err) console.log(err);
            callback(err, rows[0].name);
        });
    });
};

exports.addArtist = function(name, callback) {
    var data = {
        'name': name,
        'added': Date.now()
    };
    db.artists.find({'name':name}).toArray(function(err, rows) {
        if (rows.length > 0) {
            callback(new Error('Artist name already exists'));
        } else {
            db.artists.save(data, function(err, row) {
                callback(err);
            });
        }
    });
};