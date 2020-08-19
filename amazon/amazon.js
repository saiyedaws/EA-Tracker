let bg_port = chrome.runtime.connect({ name: "amazon" });


bg_port.onMessage.addListener((request) => 
{

    if(request.from === "from_background_test" && request.type === 'print_amazon_data') 
    {
        console.log("from_background_test");

    }



});













setInterval(() => {
    console.log("Time out!");
    location.reload();
}, 90000);

if (/complete|interactive|loaded/.test(document.readyState)) {
    // In case the document has finished parsing, document's readyState will
    // be one of "complete", "interactive" or (non-standard) "loaded".
    startPage();
} else {
    // The document is not ready yet, so wait for the DOMContentLoaded event
    console.log("Page Not Ready Yet!");

    document.addEventListener('DOMContentLoaded', startPage, false);
}











function startPage() {
    let bg_port = chrome.runtime.connect({ name: "amazon" });


    if (document.title === "Robot Check") 
    {
        setTimeout(() => 
        {
            console.log("Robot Check Doc Found");

            var captchaImgUrl = document.querySelectorAll(".a-text-center.a-row")[1].querySelectorAll("img")[0].getAttribute("src");
            bg_port.postMessage({ type: 'amazon_captcha_found', captchaImgUrl: captchaImgUrl });
    
    
            bg_port.onMessage.addListener((request) => {
    
                if (request.type === 'amazon_captcha_solved') {
                    console.log("code: " + request.captchaKey)
    
                    var typeCaptchaTextBox = document.getElementById("captchacharacters");
                    typeCaptchaTextBox.value = request.captchaKey;
    
                    setTimeout(() => {
                        document.querySelectorAll('button[type="submit"]')[0].click();
                    }, 2000);
    
    
                }
    
    
    
            });
            
        }, 10000);







    } else {

        scrapeAmazon();
    }


}













async function scrapeAmazon() {
    //If scraping doesnt finish in 60 seconds, refresh page
    console.log("Scrape Amazon begins");

    //await waits for completion before next function starts
    await checkIfPriceExists();

    var isPrimeEligible = await IsEligibleForPrime();

    var amazonItemData =
    {
        isPageCorrectlyOpened: IsPageCorrectlyOpened(),
        isItemAvailable: IsItemAvailable(),

        availabilityMessage: GetAvailabilityMessage(),
        isItemDeliveryExtended: isItemDeliveryExtended(),
        deliveryTimeMessage: getDeliveryTimeMessage(),
        amazonItemUrl: getCurrentUrl(),
        price: getAmazonPrice(),
        isEligibleForPrime: isPrimeEligible,

    }

    console.log(amazonItemData);


    console.log("sending msg ot BG");

    chrome.runtime.sendMessage({
        type: 'from_amazon',
        command: "fetched_data",
        amazonItemData: amazonItemData

    });



}

//https://www.amazon.ca/dp/B072DWYBL7

function checkIfPriceExists() {
    return new Promise(resolve => {

   
        try {
            if (!IsItemAvailable()) 
            {
                
                resolve();

            }

            if (IsItemAvailable()) {
                var priceElement = getPriceElement();

                priceString = priceElement.innerText.replace("CDN$ ", "");


                resolve();

            }
        } catch (error) {
            console.log(error);

        }

    });





}

function getPriceElement() {




    var priceElement =
        document.getElementById("price_inside_buybox") ||
        document.getElementById("newBuyBoxPrice") ||
        document.getElementById("priceblock_ourprice") ||
        document.getElementById("priceblock_saleprice") ||
        document.getElementById("buyNewSection") ||
        document.getElementById("buyNew_noncbb") ||
        document.getElementById("priceblock_dealprice")
        ;


    //Elements with weird options
    if(document.querySelectorAll("#buybox-see-all-buying-choices-announce").length > 0)
    {
        var priceElement = document.createElement("div");
        priceElement.innerText = "-99999.00"

        
    }    



    return priceElement;

}



function getAmazonPrice() {
    var priceString = "-1";


    if (IsItemAvailable()) {
        var priceElement = getPriceElement();

        ;

        priceString = priceElement.innerText.replace("CDN$ ", "");

    }





    return Number(priceString);

}


function getElementByXPath(element, xPath) {

    var headings = document.evaluate(xPath, element, null, XPathResult.ANY_TYPE, null);
    var thisHeading = headings.iterateNext();

    return thisHeading;
}






function getCurrentUrl() {

    return window.location.href;
}

function IsEligibleForPrime() 
{
    //Looking for:
    //sold by anboer and fulfilled by amazon.
    //ships from and sold by amazon.ca

    function callback(element)
    {
        var isItemFullfilledByAmazon = false;
        isItemFullfilledByAmazon = element.innerText.toLowerCase().includes("amazon");


        console.log("isItemFullfilledByAmazon: "+isItemFullfilledByAmazon);
        return isItemFullfilledByAmazon;
    }


    return new Promise(resolve=>{



        
        waitUnitEitherElementExists("#buybox-tabular .a-truncate-full","#merchant-info", 0, (element)=>
            {
                console.log("resolving begin");

                if(element){
                    var isItemFullfilledByAmazon = false;
                    isItemFullfilledByAmazon = element.innerText.toLowerCase().includes("amazon");
            
            
                    console.log("isItemFullfilledByAmazon: "+isItemFullfilledByAmazon);
                    resolve(isItemFullfilledByAmazon);
                }
                else{
                
                    resolve(false);
                }
        });
        
     

        
    });





   

    //return waitLimitedTimeUntilInnerTextExists(".a-truncate-full.a-offscreen", callback, 0);
}



//Unavailable Message: B01HLYKBOM :available from these sellers. Fix this
function IsItemAvailable() {

    var isItemAvailable = false;
    var doesAvailabilityElementExist = document.querySelectorAll("#availability").length || false;

    if (doesAvailabilityElementExist) {
        var availability = GetAvailabilityMessage();


        console.log(availability)

        if
            (
            availability === "in stock." ||
            availability === "only 3 left in stock." ||
            availability === "only 4 left in stock." ||
            availability === "only 5 left in stock." ||
            availability === "only 6 left in stock." ||
            availability === "only 7 left in stock." ||
            availability === "only 8 left in stock." ||
            availability === "only 9 left in stock." ||
            availability === "only 10 left in stock." ||
            availability === "only 3 left in stock (more on the way)." ||
            availability === "only 4 left in stock (more on the way)." ||
            availability === "only 5 left in stock (more on the way)." ||
            availability === "only 6 left in stock (more on the way)." ||
            availability === "only 7 left in stock (more on the way)." ||
            availability === "only 8 left in stock (more on the way)." ||
            availability === "only 9 left in stock (more on the way)." ||
            availability === "only 10 left in stock (more on the way)." ||
            availability === "available to ship in 1-2 days." ||
            availability === "usually ships within 2 to 3 days."

        ) {
            isItemAvailable = true;
        }


    }


    return isItemAvailable;
}



function GetAvailabilityMessage() {
    var availability = "Not Yet Defined."
    var doesAvailabilityElementExist = document.querySelectorAll("#availability").length || false;


    if (doesAvailabilityElementExist) {
        availability = document.querySelectorAll("#availability")[0].innerText.toLowerCase();
        availability = availability.replace(/^\s+|\s+$|\s+(?=\s)/g, "");

    }


    return availability;
}


function IsPageCorrectlyOpened() {
    //Returns False if their is no amazon image Block Holder
    return !!document.querySelectorAll('#imageBlock').length;
}


function isItemDeliveryExtended() {

    var isItemDeliveryExtended = false;


    if (document.body.innerText.indexOf("Extended delivery time") > -1) {

        isItemDeliveryExtended = true;

    } else {

        isItemDeliveryExtended = false;

    }


    return isItemDeliveryExtended;
}


function getDeliveryTimeMessage() {
    var deliveryTimeMessage = "No Delivery Message";


    if (document.querySelectorAll("#delivery-message").length) {
        deliveryTimeMessage = document.getElementById("delivery-message").innerText.replace(/^\s+|\s+$|\s+(?=\s)/g, "");

    }

    return deliveryTimeMessage;
}