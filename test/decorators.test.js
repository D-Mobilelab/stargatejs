var requireCondition = require("../src/modules/Decorators").requireCondition;

describe("Decorators test",function(){
    var foo = null;
    beforeEach(function(){
        foo = {
            myFunction:function(){
                console.log("Yeah");
            }
        };
    });
    
    it("Should execute the function on condition", function(){        
     
        spyOn(foo, "myFunction");
        var wrappedFunction = requireCondition(true, foo.myFunction, null, "Need initialization");
        
        wrappedFunction();        
        expect(foo.myFunction).toHaveBeenCalled();
         
    });
    
    it("Should execute the function after a function that returns boolean", function(){        
     
        spyOn(foo, "myFunction");
        var wrappedFunction = requireCondition(function(){return true;}, foo.myFunction, null, "Need initialization");
        
        wrappedFunction();        
        expect(foo.myFunction).toHaveBeenCalled();
         
    });
    
    it("Should throws an Error if the before function return false", function(){        
     
        spyOn(foo, "myFunction");
        var wrappedFunction = requireCondition(function(){return false;}, foo.myFunction, null, "Need initialization", "error");
        
        expect(wrappedFunction).toThrow();
        expect(foo.myFunction).not.toHaveBeenCalled();
         
    });
    
    it("Should execute the function with correct arguments after a function that returns boolean", function(){        
     
        spyOn(foo, "myFunction");
        var wrappedFunction = requireCondition(function(){return true;}, foo.myFunction, null, "Need initialization");
        
        wrappedFunction("Stringa", 1, {});
        expect(foo.myFunction).toHaveBeenCalledWith("Stringa", 1, {});
         
    });
    
});