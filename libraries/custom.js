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
        
