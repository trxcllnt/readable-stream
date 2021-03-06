'use strict';
var common = require('../common');
var R = require('../../lib/_stream_readable');
var util = {
  inherits: require('inherits')
};

// tiny node-tap lookalike.
module.exports = function (t) {
  var test = t.test;
  /////

  util.inherits(TestReader, R);

  function TestReader(n, opts) {
    R.call(this, opts);

    this.pos = 0;
    this.len = n || 100;
  }

  TestReader.prototype._read = function(n) {
    setTimeout(function() {

      if (this.pos >= this.len) {
        // double push(null) to test eos handling
        this.push(null);
        return this.push(null);
      }

      n = Math.min(n, this.len - this.pos);
      if (n <= 0) {
        // double push(null) to test eos handling
        this.push(null);
        return this.push(null);
      }

      this.pos += n;
      var ret = Buffer.alloc(n);
      ret.fill('a');

      //console.log('this.push(ret)', ret);

      return this.push(ret);
    }.bind(this), 1);
  };

  test('setEncoding utf8', function(t) {
    var tr = new TestReader(100);
    tr.setEncoding('utf8');
    var out = [];
    var expect =
      [ 'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa' ];

    tr.on('readable', function flow() {
      var chunk;
      while (null !== (chunk = tr.read(10)))
        out.push(chunk);
    });

    tr.on('end', function() {
      t.same(out, expect);
      t.end();
    });
  });


  test('setEncoding hex', function(t) {
    var tr = new TestReader(100);
    tr.setEncoding('hex');
    var out = [];
    var expect =
      [ '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161' ];

    tr.on('readable', function flow() {
      var chunk;
      while (null !== (chunk = tr.read(10)))
        out.push(chunk);
    });

    tr.on('end', function() {
      t.same(out, expect);
      t.end();
    });
  });

  test('setEncoding hex with read(13)', function(t) {
    var tr = new TestReader(100);
    tr.setEncoding('hex');
    var out = [];
    var expect =
      [ '6161616161616',
        '1616161616161',
        '6161616161616',
        '1616161616161',
        '6161616161616',
        '1616161616161',
        '6161616161616',
        '1616161616161',
        '6161616161616',
        '1616161616161',
        '6161616161616',
        '1616161616161',
        '6161616161616',
        '1616161616161',
        '6161616161616',
        '16161' ];

    tr.on('readable', function flow() {
      //console.log('readable once');
      var chunk;
      while (null !== (chunk = tr.read(13)))
        out.push(chunk);
    });

    tr.on('end', function() {
      //console.log('END');
      t.same(out, expect);
      t.end();
    });
  });

  test('setEncoding base64', function(t) {
    var tr = new TestReader(100);
    tr.setEncoding('base64');
    var out = [];
    var expect =
      [ 'YWFhYWFhYW',
        'FhYWFhYWFh',
        'YWFhYWFhYW',
        'FhYWFhYWFh',
        'YWFhYWFhYW',
        'FhYWFhYWFh',
        'YWFhYWFhYW',
        'FhYWFhYWFh',
        'YWFhYWFhYW',
        'FhYWFhYWFh',
        'YWFhYWFhYW',
        'FhYWFhYWFh',
        'YWFhYWFhYW',
        'FhYQ==' ];

    tr.on('readable', function flow() {
      var chunk;
      while (null !== (chunk = tr.read(10)))
        out.push(chunk);
    });

    tr.on('end', function() {
      t.same(out, expect);
      t.end();
    });
  });

  test('encoding: utf8', function(t) {
    var tr = new TestReader(100, { encoding: 'utf8' });
    var out = [];
    var expect =
      [ 'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa',
        'aaaaaaaaaa' ];

    tr.on('readable', function flow() {
      var chunk;
      while (null !== (chunk = tr.read(10)))
        out.push(chunk);
    });

    tr.on('end', function() {
      t.same(out, expect);
      t.end();
    });
  });


  test('encoding: hex', function(t) {
    var tr = new TestReader(100, { encoding: 'hex' });
    var out = [];
    var expect =
      [ '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161',
        '6161616161' ];

    tr.on('readable', function flow() {
      var chunk;
      while (null !== (chunk = tr.read(10)))
        out.push(chunk);
    });

    tr.on('end', function() {
      t.same(out, expect);
      t.end();
    });
  });

  test('encoding: hex with read(13)', function(t) {
    var tr = new TestReader(100, { encoding: 'hex' });
    var out = [];
    var expect =
      [ '6161616161616',
        '1616161616161',
        '6161616161616',
        '1616161616161',
        '6161616161616',
        '1616161616161',
        '6161616161616',
        '1616161616161',
        '6161616161616',
        '1616161616161',
        '6161616161616',
        '1616161616161',
        '6161616161616',
        '1616161616161',
        '6161616161616',
        '16161' ];

    tr.on('readable', function flow() {
      var chunk;
      while (null !== (chunk = tr.read(13)))
        out.push(chunk);
    });

    tr.on('end', function() {
      t.same(out, expect);
      t.end();
    });
  });

  test('encoding: base64', function(t) {
    var tr = new TestReader(100, { encoding: 'base64' });
    var out = [];
    var expect =
      [ 'YWFhYWFhYW',
        'FhYWFhYWFh',
        'YWFhYWFhYW',
        'FhYWFhYWFh',
        'YWFhYWFhYW',
        'FhYWFhYWFh',
        'YWFhYWFhYW',
        'FhYWFhYWFh',
        'YWFhYWFhYW',
        'FhYWFhYWFh',
        'YWFhYWFhYW',
        'FhYWFhYWFh',
        'YWFhYWFhYW',
        'FhYQ==' ];

    tr.on('readable', function flow() {
      var chunk;
      while (null !== (chunk = tr.read(10)))
        out.push(chunk);
    });

    tr.on('end', function() {
      t.same(out, expect);
      t.end();
    });
  });

  test('chainable', function(t) {
    var tr = new TestReader(100);
    t.equal(tr.setEncoding('utf8'), tr);
    t.end();
  });
}
