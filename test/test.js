var assert = require("assert");
var route = require("../routes/api.js");

describe('validateFqdn', function() {
    it('should return true  when value is google.com', function() {
        assert.equal(true, route.validateFqdn('google.com'));
    });
    it('should return true  when value is www.google.com', function() {
        assert.equal(true, route.validateFqdn('www.google.com'));
    });
    it('should return true  when value is qqq.y-a-v-a.org', function() {
        assert.equal(true, route.validateFqdn('qqq.y-a-v-a.org'));
    });
    it('should return false when value is localhost', function() {
        assert.equal(false, route.validateFqdn('localhost'));
    });
    it('should return true  when value is 911.edu', function() {
        assert.equal(true, route.validateFqdn('911.edu'));
    });

    it('should return false when value is undefined', function() {
        assert.equal(false, route.validateFqdn(undefined));
    });
    it('should return false when value is empty string', function() {
        assert.equal(false, route.validateFqdn(''));
    });
});

var api = require('../lib/artist-api.js');

describe('validateKey', function() {
    it('should return false for invalid key 503327807fe338b770050ddcc835e588d218a8833ed8b0d5690c7031e175c78', function() {
        api.validateKey('503327807fe338b770050ddcc835e588d218a8833ed8b0d5690c7031e175c78', function(err, row) {
            assert.equal(false, !!row.length);
        });
    });
    it('should return true for valid key 503327807fe338b770050ddcc835e588d218a8833ed8b0d5690c7031e175c784', function() {
        api.validateKey('503327807fe338b770050ddcc835e588d218a8833ed8b0d5690c7031e175c784', function(err, row) {
            assert.equal(true, !!row.length);
        });
    });
    it('should return 8fbaa165d8d0ebae6c16d495b15c381a893782ab34280a0aa70dc539f4081971 for fqdn www.google.com and time 1410984147100', function() {
        var now = 1410984147100;
        var key = api.generateKey('www.google.com', now);
        assert.equal('8fbaa165d8d0ebae6c16d495b15c381a893782ab34280a0aa70dc539f4081971', key);
    });
});