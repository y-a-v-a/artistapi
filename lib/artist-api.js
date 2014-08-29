var crypto = require('crypto');

exports.getKey = function(fqdn, now) {
    var str = fqdn + now;
    return crypto
        .createHash('sha256')
        .update(str)
        .digest('hex');
};

exports.getArtist = function(req, callback) {
    var count = 0;
    var rand = null;
    req.db.artists.find().toArray(function(err, rows) {
        count = rows.length;
        rand = function(){
            return Math.floor( Math.random() * count );
        };
        req.db.artists.find().limit(-1).skip(rand()).toArray(function(err, rows) {
            if (err) console.log(err);
            callback(err, rows[0].name);
        });
    });
};

exports.addArtist = function(req, name, callback) {
    var data = {
        'name': name,
        'added': Date.now()
    };
    req.db.artists.save(data, function(err, row) {
        callback(err);
    });
};