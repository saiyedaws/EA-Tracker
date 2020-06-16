let bg_port = chrome.runtime.connect({ name: "popup" });

document.getElementById("main_form").addEventListener("submit", function(e) {
    e.preventDefault();

    var pgNumber = document.getElementById("pgNumber").value;
    bg_port.postMessage({ type: "start" , pgNumber: pgNumber});
});




document.getElementById("checkSku_form").addEventListener("submit", function(e) {
    e.preventDefault();

    var itemNumber = document.getElementById("itemNumber").value;
    bg_port.postMessage(
        
    {
         type: "checkSkuWithItemNumber",
         itemNumber: itemNumber

    });
    
});


document.getElementById("setQuantity_form").addEventListener("submit", function(e) 
{
    e.preventDefault();

    var itemNumber = document.getElementById("itemNumber").value;
    var quantity = document.getElementById("quantity").value;

    console.log(itemNumber);
    console.log(quantity);

    bg_port.postMessage(
    { 
        type: "setQuantityWithItemNumber",
        itemNumber: itemNumber,
        quantity: quantity
    
    });
    
});




document.getElementById("setPrice_form").addEventListener("submit", function(e) 
{
    e.preventDefault();

    var itemNumber = document.getElementById("itemNumber").value;
    var price = document.getElementById("priceID").value;

    console.log(itemNumber);
    console.log(price);

    bg_port.postMessage(
    { 
        type: "from_popup",
        command:"set_price_with_item_number",
        itemNumber: itemNumber,
        price: price
    
    });
    
});








document.getElementById("amazon_form").addEventListener("submit", function(e) {
    e.preventDefault();

    console.log("Amazon Button Start");


    bg_port.postMessage(
        { 
            type: "from_popup",
            command:"print_amazon_data",

        
        });


});


