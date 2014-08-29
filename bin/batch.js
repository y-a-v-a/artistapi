var mongoskin = require('mongoskin');
var fs = require('fs');
var db = mongoskin.db('mongodb://localhost:27017/artistapi?auto_reconnect', { safe: true });
var artists = db.collection('artists');

var file = process.argv[2];
if (typeof file === 'undefined') {
    console.log('No file supplied');
    process.exit(1);
}

var contents = JSON.parse(fs.readFileSync(file, { encoding: 'utf8'}));

function callback(err) {
    if (err) console.log(err);
    if (contents.length > 0) {
        var data = {
            'name': contents.shift(),
            'added': Date.now()
        };
        console.log(data);
        artists.save(data, callback);
    }
}

callback(null);