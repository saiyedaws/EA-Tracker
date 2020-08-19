var waitUntilElementExists = (selector, callback) => 
{
        var el = document.querySelector(selector);
        console.log("Checking");
        
        if (el){
            console.log("Found");
            return callback(el);
        }
        
        setTimeout(() => waitUntilElementExists(selector, callback), 500);
}
        



var waitLimitedTimeUntilInnerTextExists = (selector, loopNumber, callback) => 
{
   
        var el = document.querySelector(selector);




        console.log("Loop# "+loopNumber);
        
        if (el){
            console.log("Found");

            console.log(el);

            return callback(el);
        }
        
        if(loopNumber === 10)
        {

            return callback(null);
        }
        
    
        setTimeout(() => waitLimitedTimeUntilInnerTextExists(selector, loopNumber+1, callback), 500);
}



var waitUnitEitherElementExists = (selector,selector2, loopNumber, callback) => 
{
   
        var el = document.querySelector(selector);




        console.log("Loop# "+loopNumber);
        if (el)
        {
            console.log("Found el");
            console.log(el);
            return callback(el);
        }

        var el2 = document.querySelector(selector2);

        if (el2)
        {
            console.log("Found el2");
            console.log(el2);
            return callback(el2);
        }
        


        if(loopNumber === 10)
        {

            return callback(null);
        }
        
    
        setTimeout(() => waitLimitedTimeUntilInnerTextExists(selector, loopNumber+1, callback), 500);
}

        
