var Utils = require("../src/modules/Utils");
var queryfy = Utils.queryfy;
var dequeryfy = Utils.dequeryfy;
var extend = Utils.extend;
describe("Utils tests", function(){
    
    
    beforeEach(function() {
    
    });

    afterEach(function() {
    
    });
    
    it("Test queryfy", function(){
        var result = queryfy("",{a:"b b","c":"a"});
        expect(result).toBe("?a=b%20b&c=a");
    });
    
    it("Test dequeryfy", function(){
        var result = dequeryfy("?a=b%20b&c=a");
        expect(result).toEqual({a:"b b","c":"a"});
    });
    
    it("Test queryfy with a key with null value", function(){
        var result = queryfy("",{a:"b b","c":null});
        expect(result).toBe("?a=b%20b&c");
    });
    
    it("Test queryfy with a key with undefined value", function(){
        var result = queryfy("",{a:"b b","c":undefined});
        expect(result).toBe("?a=b%20b&c");
    });
    
    it("Test extend object", function(){
        var override = extend({aa:1}, {aa:2});
        var ovverrideAndExtend = extend({aa:1}, {aa:2, bb:"c"});
        
        //
        expect(override).toEqual({aa:2});
        expect(ovverrideAndExtend).toEqual({aa:2,bb:"c"});
        expect(function(){
            var diffenrentType = extend({aa:1}, new Date);
        }).toThrow(new Error("Cannot merge different type"));
    });

});