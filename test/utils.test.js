var queryfy = require('../src/modules/Utils').queryfy;
var dequeryfy = require('../src/modules/Utils').dequeryfy;
var extend = require('../src/modules/Utils').extend;

describe('Utils tests', () => {
    
    
    beforeEach(() => {
    
    });

    afterEach(() => {
    
    });
    
    it('Test queryfy', () => {
        var result = queryfy('', { a: 'b b', 'c': 'a' });
        expect(result).toBe('?a=b%20b&c=a');
    });

    it('Test queryfy with 0 type number as value', () => {
        var result = queryfy('', { a: 0, 'c': '0' });
        expect(result).toBe('?a=0&c=0');
    });
    
    it('Queryfy should work with a key with null value', () => {
        var result = queryfy('', { a: 'b b', 'c': null });
        expect(result).toBe('?a=b%20b&c');
    });

    it('Queryfy Should add other query params if already have keys', function(){
        var result = queryfy('http://pippo.com/?comment=1&c=2', { a: 2, c: null });
        result = result.slice(result.indexOf('?') + 1, result.length).split('&');

        expect(result.indexOf('comment=1') > -1).toEqual(true);
        expect(result.indexOf('a=2') > -1).toEqual(true);
        expect(result.indexOf('c') > -1).toEqual(true);
        expect(result.indexOf('c=2') > -1).toEqual(false);
    });
    
    it('Dequeryfy should decode correct', function(){
        var result = dequeryfy('?a=b%20b&c=a');
        expect(result).toEqual({ a: 'b b', 'c': 'a' });
    });
    
    it('Dequeryfy should handle empty string', function(){
        var result = dequeryfy('');
        expect(result).toEqual({});
    });

    it('Dequeryfy should handle string without querystring', function(){
        var result = dequeryfy('http://pippo.com');
        expect(result).toEqual({});
    });
    
    it('Test queryfy with a key with undefined value', function(){
        var result = queryfy('', { a: 'b b', 'c': undefined });
        expect(result).toBe('?a=b%20b&c');
    });

    it('Test queryfy should not modify params passed by reference', () => {
        var api = 'http://pippo.com/';
        var result = queryfy(api, { a: 'b b', 'c': 5 });
        expect(result).toBe('http://pippo.com/?a=b%20b&c=5');
        expect(api).toEqual('http://pippo.com/');
    });
    
    it('Test extend object', function(){
        var override = extend({ aa: 1 }, { aa: 2 });
        var ovverrideAndExtend = extend({ aa: 1 }, { aa: 2, bb: 'c' });
        
        //
        expect(override).toEqual({ aa: 2 });
        expect(ovverrideAndExtend).toEqual({ aa: 2, bb: 'c' });
        expect(function(){
            var diffenrentType = extend({ aa: 1 }, new Date);
        }).toThrow(new Error('Cannot merge different type'));
    });

});