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