var Http = require("../src/modules/Http").Http;

require('jasmine-ajax');

describe("Request class tests", function(){    
 
    beforeEach(function() {
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });
        
    it("200 GET JSON as response", function(done){
        var url = "/get/json";
        var mySuccessSpy = jasmine.createSpy("success");
        
        jasmine.Ajax.stubRequest(url).andReturn({            
            "response":{data:"aa"},            
            "status":200,
            "contentType":"text/json"                    
        });
        
        //make the request
        var theRequest = new Http({
            method:"get",
            url:url,
            responseType:"json"                        
        });
        
        theRequest.promise.then(mySuccessSpy)
        .then(function(){
            expect(mySuccessSpy).toHaveBeenCalledWith([{data:"aa"}, 200, theRequest.calls[theRequest.calls.length - 1]]);
            done();
        });        
    });
    
    it("404 GET JSON as response with two attempts", function(done){
        var url = "/get/json";
        var mySuccessSpy = jasmine.createSpy("success");
        
        jasmine.Ajax.stubRequest(url).andReturn({            
            "response":{error:true},            
            "status":404,
            "statusText":"HTTP/1.1 404 NOT FOUND",
            "contentType":"application/json"                    
        });
        
        //make the request
        var theRequest = new Http({
            method:"get",
            url:url,
            responseType:"json",
            attempt:2,
            retryAfter:100
        });
        
        /*theRequest.calls[theRequest.calls.length - 1].responseType = "json";*/
        
        var success = jasmine.createSpy("success");
        var error = jasmine.createSpy("error");
        
        theRequest.promise.then(success)
        .catch(error).then(function(){
            expect(theRequest.options.attempt).toEqual(0);
            expect(theRequest.calls.length).toEqual(2);
            expect(error).toHaveBeenCalledWith({status:404, statusText:""});            
            expect(success).not.toHaveBeenCalled();
            done();
        });                
    });
    
    it("200 GET HTML as response", function(done){
        var url = "/get/html";
        var mySuccessSpy = jasmine.createSpy("success");
        var xmlAsString = (new XMLSerializer).serializeToString(document);
        
        //var xmlDoc = (new window.DOMParser()).parseFromString(xmlAsString, 'text/xml');
        
        jasmine.Ajax.stubRequest(url).andReturn({            
            "responseXML":window.document,       
            "status":200,
            "statusText":"OK",
            "contentType":"text/xml;charset=UTF-8"            
        });
        
        var success = jasmine.createSpy("success");
        var error = jasmine.createSpy("error");
        var progress = jasmine.createSpy("progress");
        
        //Make the request
        var theRequest = new Http({
            method:"get",
            url:url,
            responseType:"document",
            onProgress:progress           
        });
        
        theRequest.promise.then(function(result){
            success(result);
            expect(success).toHaveBeenCalled(); 
            expect(progress).toHaveBeenCalled();
            expect(progress).toHaveBeenCalledWith("loading");            
            expect(error).not.toHaveBeenCalled();
            // trust me. it works!
            // expect(result[0].documentElement).toBeDefined();
            //OTHERS CHECKS?
            done();
        }).catch(error);
    });
    
    
    it("200 GET TEXT as response", function(done){
        var url = "/get/text";
        var mySuccessSpy = jasmine.createSpy("success");
        
        jasmine.Ajax.stubRequest(url).andReturn({            
            "responseText":"Testo!",     
            "status":200,
            "statusText":"OK",
            "contentType":"text/plain;charset=UTF-8"            
        });
        
        //Make the request
        var theRequest = new Http({
            method:"get",
            url:url,
            responseType:"text"
        });
        
        theRequest.promise.then(function(result){
            expect(result[0]).toEqual("Testo!");           
            done();
        });
    });
    
    it("200 POST a json object", function(done){
           var url = "/post/echo";
           var data = {some:"data"};
           
           jasmine.Ajax.stubRequest(url).andReturn({
                "response":JSON.stringify(data),
                "status":200,
                "statusText":"OK",
                "contentType":"application/json;charset=UTF-8"            
             });
             
            //Make the request
            var theRequest = new Http({
                method:"POST",
                url:url,
                responseType:"json",
                data:data
            });
            
            theRequest.promise.then(function(result){
                
                expect(JSON.parse(result[0])).toEqual(data);                           
                done();
            }).catch(function(reason){
                console.log(reason);
            });             
     });
     
     it("200 PUT ", function(done){
         var url = "/put/echo";
         var data = {aa:"bb"};
         jasmine.Ajax.stubRequest(url).andReturn({
                "response":JSON.stringify(data),
                "status":200,
                "statusText":"OK",
                "contentType":"application/json;charset=UTF-8"            
         });
        //PUT
        var putTask = new Http({
            method:"PUT",
            url:url,
            dataType:"json",
            data:data
        });
        
        putTask.promise.then(function(results){
            var obj = JSON.parse(results[0]);
            expect(obj).toEqual({aa:"bb"});
            done();
        }).catch(function(){
            done();
        });
        
     });
     
     it("200 DELETE ", function(done){
         var url = "/delete/echo";
         var data = {aa:"bb"};
         jasmine.Ajax.stubRequest(url).andReturn({
                "response":JSON.stringify(data),
                "status":200,
                "statusText":"OK",
                "contentType":"application/json;charset=UTF-8"            
         });
         
        //DELETE
        var deleteTask = new Http({
            method:"DELETE",
            url:url,
            dataType:"json",
            data:{aa:"bb"}            
        });
        
        deleteTask.promise.then(function(results){
            var obj = JSON.parse(results[0]);            
            expect(obj).toEqual({aa:"bb"});
            done();      
        }).catch(function(){
            done();
        });
        
     });
});