chrome.extension.onConnect.addListener(port => {

    // Checks the connection source
    if(port.name === 'popup') 
    {

        popup_port = port;

        // Begins to listen messages from popup
        popup_port.onMessage.addListener(request => {

            // Checks the form submission
            if(request.type === 'checkSkuWithItemNumber') 
            {
                testCheckSku(request.itemNumber);
            }


            // Checks the form submission
            if(request.type === 'setQuantityWithItemNumber') 
            {
                console.log("Debug Mode");
                testSetItemQuantity(request.itemNumber, request.quantity);
            }




        });

        popup_port.onDisconnect.addListener(() => popup_port = null );
    }


});




async function testCheckSku(itemNumber)
{



    var item = await GetItemQuantityAndSku(itemNumber);
    console.log(item);
    
    await checkSKU(atob(item.SKU), item.quantity, item.itemNumber);
    console.log("checkSKU Resolved");

    await checkToEndItemListing(item.SKU);
    console.log("checkToEndItemListing Resolved");


}


async function testSetItemQuantity(testItemNumber, testQuantity)
{

    await setItemQuantity(testItemNumber, testQuantity);
    console.log("setItemQuantity Resolved");

    await checkToEndItemListing(testItemNumber);
    console.log("checkToEndItemListing Resolved");
}


function GetItemQuantityAndSku(itemNumber) 
{
    var item;

    return new Promise(resolve => 
    {

        ebay_port.postMessage(
            { 
                type: 'getItemQuantityAndSku', 
                itemNumber: itemNumber
        
            }
        );



        ebay_port.onMessage.addListener(function ebayReceiveItemQuantityAndSkuRequest(request) 
        {


            if(request.type === 'sentItemQuantityAndSku' && request.itemNumber === itemNumber) 
            {
                ebay_port.onMessage.removeListener(ebayReceiveItemQuantityAndSkuRequest);

                item = 
                {
                    itemNumber: request.itemNumber,
                    SKU: request.sku,
                    quantity: request.quantity
        
                }

                resolve(item);
                
            }
            

           
        });


        
    });



}