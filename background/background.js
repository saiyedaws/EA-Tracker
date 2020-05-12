let popup_port, 
    ebay_port,
    amazon_port,
    ebay_end_port,
    main_tab,
    process_status = false,
    pagination_offset = -50,
    total_active_listings,
    page_items_count = 0,
    iteration_items_count = 0,
    totalPageNumbe = 0,
    currentPageNumber = 0,
    endListing_tab,
    didItemFailToUpdate = false;

// Checks connections and waits the popup
chrome.extension.onConnect.addListener(port => {

    // Checks the connection source
    if(port.name === 'popup') 
    {

        popup_port = port;

        // Begins to listen messages from popup
        popup_port.onMessage.addListener(request => {

            // Checks the form submission
            if(request.type === 'start') 
            {
                //startProcess();

                pagination_offset = pagination_offset + (request.pgNumber - 1)*50
                startNextPage();
            }
        });

        popup_port.onDisconnect.addListener(() => popup_port = null );
    }

    if(port.name === 'ebay_list') 
    {

        ebay_port = port;

        // Begins to listen messages from Ebay
        ebay_port.onMessage.addListener(request => {
            
            if(request.type === 'SKU_codes') 
            {
                checkSKUList(request.sku_list);
            }

            if(request.type === 'total_active_listings') 
            {
                total_active_listings = request.count;
            }

            if(request.type === 'pgNumber') 
            {
                totalPageNumber = request.totalPageNumber;
                currentPageNumber = request.currentPageNumber;

                console.log(currentPageNumber+"/"+totalPageNumber);
            }

        });

        ebay_port.onDisconnect.addListener(() => ebay_port = null);
    }







});





function startNextPage() {
    process_status = true;

    return new Promise(resolve => 
        {

            setTimeout(() => {



                page_items_count = 0;
                pagination_offset += 50;
            
                // Closing previous tab
                  try{
                    chrome.tabs.remove(main_tab);
                    main_tab = null;
                  }catch(err){};
            
                
        
        
                    chrome.tabs.create({ url: 'https://www.ebay.ca/sh/lst/active?offset=' + pagination_offset + '&limit=50&sort=timeRemaining', active: false }, function(tab) {
        
                    // Saving ID of Ebay listing page tab
                    main_tab = tab.id;
        
                    // Defining of needed page inside a script
                    chrome.tabs.executeScript(main_tab, { code: 'let isWorkingPage = true;', runAt: 'document_end' });

                    resolve();
                });
                    
               
        
                
        
        
        
            }, 5000);



        });




}




async function checkSKUList(list) 
{


    total_page_items = list.length;

    for(item of list) 
    {

        ebay_port.postMessage({ type: 'scroll_to_itemNumber', itemNumber: item.itemNumber });

        //If item SkU has zero Chars
        if(!item.SKU.length) 
        {

            page_items_count++;
            console.log('Please Add SKU For ItemNumber: '+item.itemNumber);

            if(item.quantity > 0)
            {
                await setItemQuantity(item.itemNumber, 0);
            }
            
            

            continue;
        }

        await checkSKU(atob(item.SKU), item.quantity, item.itemNumber);

        await checkToEndItemListing(item.itemNumber);

        
        page_items_count++;


      
    }


    await checkNextPage();
}



function checkNextPage()
{
    return new Promise(resolve => 
        {


            if(currentPageNumber === totalPageNumber)
            {
                console.log("On the Last Page!");
                pagination_offset = -50;
                page_items_count = 0;
    
    
                var minute = 60 * 1000;
    
    
                console.log("Waiting 30 minutes");
                setTimeout(() => 
                {
                    startNextPage().then(() => resolve());
                }, minute*30);
                
               
    
                
    
            }else if(page_items_count >= total_page_items)
            {
    
                console.log("Starting Next Page");
                startNextPage().then(() => resolve());
            }


    });
    
        

  



}


function checkSKU(sku, quantity, itemNumber) 
{
    
    return new Promise(resolve => {

        if(sku.charAt(sku.length - 1) === '@') sku = sku.slice(0, -1) + '?th=1&psc=1';
        sku = sku.replace(/\s+/g, '');

        var amazonItemUrl = 'https://www.amazon.ca/dp/' + sku;

        chrome.tabs.create({ url: amazonItemUrl, active: false }, function(tab) {

            let amazon_tab_id = tab.id;

            chrome.tabs.executeScript(amazon_tab_id, { code: 'let checkThisProduct = true, asin = "' + sku + '";', runAt: 'document_end' }, () => {
                
                //add check that right asin is being checked
                let messageListener = function (request) {


                    if (request.type === 'amazon_data' && amazonItemUrl.toLowerCase().replace(/(\s\s\s*)/g, ' ') === request.amazonItemUrl.toLowerCase().replace(/(\s\s\s*)/g, ' ')) 
                    {

                        chrome.tabs.remove(amazon_tab_id, () => 
                        {



                            var new_quantity = -1;

                            if(!request.isPageCorrectlyOpened)
                            {
                                var errorMessage = "Amazon SKU Didnt load, Please Check/Update SKU for ItemNumber: "+ itemNumber;
                                console.log(errorMessage);

                                new_quantity = 0;

                                if(quantity > 0){
                                    setItemQuantity(itemNumber, new_quantity).then(() => resolve());
                                }else{
                                    resolve();
                                }
                                
                                
    
                            }
    
    
                            if(request.isPageCorrectlyOpened)
                            {
    

                                var isItemDeliveryExtended = false;


                                /*
                                var isItemDeliveryExtended = request.isItemDeliveryExtended;
                                if(isItemDeliveryExtended)
                                {
                                    if(quantity > 0)
                                    {
                                        console.log("Extended Delivery Message: "+itemNumber+": "+request.deliveryTimeMessage);
                                        new_quantity = 0;
                                        setItemQuantity(itemNumber, new_quantity).then(() => resolve());
                                    }else
                                    {
                                        resolve();

                                    }
                         
                                } */
                                



                                if(!isItemDeliveryExtended)
                                {

                                    /*
                                    if(!request.isItemAvailable)
                                    {
        
                                        console.log("Unavailable Message: "+sku+" :"+request.availabilityMessage);
                                    }*/
        
        
        
                                    if(request.isItemAvailable && request.isEligibleForPrime && quantity === 0)
                                    {
                                    // console.log("Item Available, Set New Quantity.");
                                        new_quantity = 1;
                                        //Set Item Quantity
        
                                        
                                        setItemQuantity(itemNumber, new_quantity).then(() => resolve());
        
                                    }
        
        
        
                                    if( (!request.isItemAvailable || !request.isEligibleForPrime) && quantity > 0)
                                    {
                                    //  console.log("Item Not Available, set quantity to zero.");
                                        new_quantity = 0;
                                    //Set Item Quantity
        
                                    setItemQuantity(itemNumber, new_quantity).then(() => resolve()); 
                                
                                    }
        
        
        
                                    //If No changes need to be made
                                    if(request.isItemAvailable && request.isEligibleForPrime && quantity > 0)
                                    {
                
                                    //  console.log("Item already Available");
                                        resolve();
        
                                    }
        
        
                                    if( (!request.isItemAvailable || !request.isEligibleForPrime) && quantity === 0)
                                    {
                    
                                    //  console.log("Unavailable or not Prime, Already Zero");
                                    resolve();
                                    }
        
        
        
                                    //Maybe we have to add resolve for quantity before zero and after zero for both conditions
    

                                }

                                
    
         
                            }
    
                        });


                       



                        chrome.runtime.onMessage.removeListener(messageListener);
                    }
                };



                chrome.runtime.onMessage.addListener(messageListener);
            });
        });
    });


}


function setItemQuantity(itemNumber, quantity) 
{
    return new Promise(resolve => 
    {

        ebay_port.postMessage({ type: 'set_item_quantity', itemNumber: itemNumber, quantity: quantity });



        ebay_port.onMessage.addListener(function ebayReceiveOnceQuantityRequest(request) 
        {


            if(request.type === 'item_quantity_set' && request.itemNumber === itemNumber && !request.doesFailToEditAlertExist) 
            {
                ebay_port.onMessage.removeListener(ebayReceiveOnceQuantityRequest);
                resolve();
            }

            if(request.doesFailToEditAlertExist) 
            {
                console.log("Failure Messages Exists");
                didItemFailToUpdate = true;
                resolve();



            }
            

            
        });




    });
}



function checkToEndItemListing(itemNumber){
    return new Promise(resolve => 
        {
    
            if(didItemFailToUpdate === true)
            {  
        
                console.log("Start End Listing!");
    
                chrome.tabs.create({ url: 'https://offer.ebay.ca/ws/eBayISAPI.dll?VerifyStop&item='+itemNumber, active: false }, function(tab) 
                {
        
                    // Saving ID of Ebay listing page tab
                    endListing_tab = tab.id;
        
        

                    // Checks connections and waits the ebay_end
                    chrome.extension.onConnect.addListener(port => {

                            // Checks the connection source
                            if(port.name === 'ebay_end') 
                            {

                                ebay_end_port = port;

                                // Begins to listen messages from ebay_end
                                ebay_end_port.onMessage.addListener(request => {

                                    // Checks the form submission
                                    if(request.type === 'ebay_end_loaded') 
                                    {
                                        //startProcess();
                                        console.log("ebay_end_loaded");

                                        ebay_end_port.postMessage({ type: 'end_listing_now'});


                                    }


                                    if(request.type === 'ended_listing') 
                                    {
                                        //startProcess();
                                        console.log("ended_listing : "+itemNumber);



                                        chrome.tabs.remove(endListing_tab);
                                        didItemFailToUpdate = false;
                                        resolve();

                                    }



                                });

                                ebay_end_port.onDisconnect.addListener(() => ebay_end_port = null );
                            }

                        
                    });
        
        
        

                    
                });

            }else{
                didItemFailToUpdate = false;
                resolve();
            }
        
           
    
    
    
    
        });

   


        


}
