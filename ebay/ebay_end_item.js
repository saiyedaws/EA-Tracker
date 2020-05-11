let bg_port = chrome.runtime.connect({ name: "ebay_end" });



console.log("ebay_end Started without Check");
bg_port.postMessage({ type: 'ebay_end_loaded'});



bg_port.onMessage.addListener((request) => 
{

    if(request.type === 'end_listing_now') 
    {
        endListing();

        console.log("Ended Listing, sending to BG! 1/2");
        setTimeout(() => {
            console.log("Ended Listing, sending to BG! 2/2");
            bg_port.postMessage({ type: 'ended_listing'});

        }, 3000);

    }



});








function endListing()
{
    if(document.querySelectorAll('[value="End My Listing"]').length || document.querySelectorAll('[value="End your listing"]').length)
    {
        //First Option
        try {
            document.querySelectorAll('[type="radio"]')[0].click();
        } catch (error) {
            
        }
       

        //Submittry
        try {
            document.querySelectorAll('[value="End My Listing"]')[0].click();

        } catch (error) {
            
        }
        

        try {
            document.querySelectorAll('[value="End your listing"]')[0].click();
        } catch (error) {
            
        }
        

        

    }



}