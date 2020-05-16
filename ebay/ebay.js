
// Connecting with the background
let bg_port = chrome.runtime.connect({ name: "ebay_list" }),
    table_rows_pattern = 'tbody[id*=grid-row]';


var totalPageNumber = 0;
var currentPageNumber = 0;  

if(typeof isWorkingPage !== 'undefined' && isWorkingPage)
{
    try 
    {
        getCurrentPgNumber();
        chrome.runtime.sendMessage({ type: 'from_ebay_list', command: "fetched_data_proceed" });
    // Send
        sendDataToBackground();
    } catch (error) 
    {
        console.log(error);
        //send to background page their was error and then refresh with is working page
        chrome.runtime.sendMessage({ type: 'from_ebay_list', command: "restart_ebay_page", error:error});
    }
    



}

function sendDataToBackground()
{
    // Send
    var totalActiveListings = parseInt($("span.results-count").html().replace(/[^0-9]/g, ''));
    bg_port.postMessage({ type: 'total_active_listings', count: totalActiveListings });
    bg_port.postMessage({ type: 'SKU_codes', sku_list: getSKUsList() });


    bg_port.postMessage({ type: 'pgNumber', totalPageNumber: totalPageNumber, currentPageNumber : currentPageNumber  });
}




bg_port.onMessage.addListener((request) => 
{

    if(request.type === 'set_item_quantity') 
    {
        setItemQuantity(request.itemNumber, request.quantity);

    }

    if(request.type === 'from_background'&& request.command === "set_item_price") 
    {
        setItemPrice(request.itemNumber, request.price);

    }




    if(request.type === 'getItemQuantityAndSku') 
    {
        getItemQuantityAndSku(request.itemNumber);

    }



    if(request.type === 'scroll_to_itemNumber')
        scrollToIndex(request.itemNumber);


});


function getItemQuantityAndSku(itemNumber)
{

    var table_row_pattern = 'tbody[id*=grid-row-'+itemNumber+']';
    $row = $(table_row_pattern).first();

    var sku = $row.find('td[class*="listingSKU"]').find('.cell-wrapper').text();
    var quantity = parseInt($row.find('td[class*="availableQuantity"]').find('.cell-wrapper').text().replace(/[^0-9]/g, ''));

    bg_port.postMessage(
        { 
            type: 'sentItemQuantityAndSku', 
            itemNumber: itemNumber,
            sku: sku,
            quantity: quantity

        });


}

function getSKUsList() {

    let items = [];

    // Looping through all table row elements on ebay active listing page
    // using jquery elements with $
    for(row of $(table_rows_pattern)) {

        //Setting variable in jQuery, this is how you select an item and make it into a jQeury element.
        let $row = $(row);

        items.push({

            SKU: $row.find('td[class*="listingSKU"]').find('.cell-wrapper').text(),
            quantity: parseInt($row.find('td[class*="availableQuantity"]').find('.cell-wrapper').text().replace(/[^0-9]/g, '')),
            itemNumber: $row.find(".grid-row").attr("data-id"),
            price: parseFloat($row.find('td[class*="price"]').find('.cell-wrapper').text().replace(/[^0-9.]/g, ''))
        
        });

    }

    return items;
}

function scrollToIndex(itemNumber) 
{
    var table_row_pattern = 'tbody[id*=grid-row-'+itemNumber+']';

    $row = $(table_row_pattern).first();

    $row.addClass('highlighted').siblings().removeClass('highlighted');
    
    $('html,body').animate({ scrollTop: $row.offset().top - 350 }, 80);
}



function setItemQuantity(itemNumber ,quantity) 
{

    setRowCellValue(itemNumber, 'availableQuantity', quantity).then(() => 
    {

        var doesFailToEditAlertExist = checkForFailToEditAlert();

        bg_port.postMessage({ type: 'item_quantity_set', itemNumber: itemNumber, doesFailToEditAlertExist: doesFailToEditAlertExist  });

    });

}


function setItemPrice(itemNumber, price)
{

    setRowCellValue(itemNumber, 'price', price).then(() => 
    {

        var doesFailToEditAlertExist = checkForFailToEditAlert();

        //bg_port.postMessage({ type: 'item_quantity_set', itemNumber: itemNumber, doesFailToEditAlertExist: doesFailToEditAlertExist  });
        bg_port.postMessage({ type: 'item_price_set', itemNumber: itemNumber, doesFailToEditAlertExist: doesFailToEditAlertExist  });

    });

}


function setRowCellValue(itemNumber, key, value) 
{

    return new Promise (resolve => {

        var table_row_pattern = 'tbody[id*=grid-row-'+itemNumber+']';

        $row = $(table_row_pattern).first();
        $row.find('td[class*="' + key + '"]').find('button[data]').click();
            

        setTimeout(
            function() 
            {
              
              document.execCommand('insertText', false, value);


              setTimeout(
                function() 
                {
                    $form = $('form[id*="inline-editors"]');
                    $form.find('button[type="submit"]').click();


                    setTimeout(() => resolve(), 8000); // Third Wait - After Submitting clicking


                }, 700);//Second Wait - After Text Enetered

            }, 500);//First Wait - After Form openm



        

    });
}


function getCurrentPgNumber()
{
    var pgNumberElement = document.getElementsByClassName("go-to-page")[0];


   // currentPageNumber = pgNumberElement.getElementsByClassName("textbox__control1")[0].value;
    currentPageNumber = pgNumberElement.getElementsByClassName("textbox__control")[0].value

    totalPageNumber = pgNumberElement.getElementsByClassName("label")[0].innerText.replace(/\D/g, "");



}


function checkForFailToEditAlert()
{
    var doesFailToEditAlertExist = document.getElementsByClassName("inline-alert inline-alert--priority").length;

    return doesFailToEditAlertExist;
}